import {getLatestContent} from '../../services/capi';
import {fetchTargetsForTags} from '../../services/TargetingApi';
import AtomsApi from '../../services/AtomsApi';
import {logError} from '../../util/logger';


function requestSuggestionsForLatestContent() {
  return {
    type:       'SUGGESTIONS_FOR_LATEST_CONTENT_REQUEST',
    receivedAt: Date.now()
  };
}

function receiveSuggestionsForLatestContent(suggestionsForLatestContent) {
  return {
    type:       'SUGGESTIONS_FOR_LATEST_CONTENT_RECEIVE',
    suggestionsForLatestContent,
    receivedAt: Date.now()
  };
}

function errorReceivingSuggestionsForLatestContent(error) {
  logError(error);
  return {
    type:       'SHOW_ERROR',
    message:    'Could not get suggests for latest content',
    error:      error,
    receivedAt: Date.now()
  };
}

const supportedAtomTypes = ["profile", "qanda", "timeline", "guide"];

function flatten(arrayOfArrays) {
  return arrayOfArrays.reduce(
    (acc, e) => acc.concat(e),
    []
  );
}

function getCurrentAtomPaths(content) {
  if (content.atoms) {
    const all = supportedAtomTypes.map(atomType => {
      const pluralAtom = `${atomType}s`;

      if (content.atoms[pluralAtom]) {
        return content.atoms[pluralAtom].map(atom => `/atom/${atomType}${atom.id}`);
      } else return []
    });

    return flatten(all)

  } else return []
}

function buildResult(content, targets) {
  const currentAtoms = getCurrentAtomPaths(content);
  const targetAtoms = targets.filter(target =>
    //make sure it's an atom and is not already on this content
    (target.url.startsWith('/atom') && currentAtoms.indexOf(target.url) === -1)
  );

  //Now query the atoms api to get full atom data for these targets
  return Promise.all(
    targetAtoms.map(atom => {
      // the 'url' has the form: /atoms/<type>/<id>
      const tokens = atom.url.split('/');
      return AtomsApi.getAtom(tokens[2], tokens[3]).then(res => res.json())
    })
  ).then(atoms => {
    return {
      id: content.id,
      headline: content.fields.headline,
      internalComposerCode: content.fields.internalComposerCode,
      atoms: atoms
    }
  });
}

/**
 * Gets all news content from past 24 hours.
 * For each content, gets any atoms from targeting api which match any
 * of the content's keyword tags (excluding any atoms already on it).
 */
export function getSuggestionsForLatestContent() {
  return dispatch => {
    dispatch(requestSuggestionsForLatestContent());

    return getLatestContent()
      .then((contentArray) => {
        return Promise.all(
          contentArray.map(content => {
            const tags = content.tags.map(tag => tag.id);

            return fetchTargetsForTags(tags).then(targets => {
              return {
                content: content,
                targets: targets
              }
            })
          })
        )
      })
      .then(contentWithTargetsArray => {
        return Promise.all(
          contentWithTargetsArray.map(contentWithTargets =>
            buildResult(contentWithTargets.content, contentWithTargets.targets)
          )
        )
      })
      .then(results => {
        dispatch(receiveSuggestionsForLatestContent(results))
      })
  };
}
