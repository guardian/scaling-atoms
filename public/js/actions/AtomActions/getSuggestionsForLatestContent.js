import {getLatestContent} from '../../services/capi';
import {fetchTargetsForTag} from '../../services/TargetingApi';
import AtomsApi from '../../services/AtomsApi';
import {atomPropType} from '../../constants/atomPropType.js';
import {logError} from '../../util/logger';
import {PropTypes} from 'react';

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

//Returns a map of tagId to content
function buildTagToContent(contentArray) {
  const tagToContent = {};
  contentArray.forEach(content => {
    const item = {
      id: content.id,
      headline: content.fields.headline,
      internalComposerCode: content.fields.internalComposerCode,
      atoms: content.atoms ? content.atoms : []
    };

    content.tags.forEach(tag => {
      if (tag.type === "keyword") {
        tagToContent[tag.id] = tagToContent[tag.id] ? tagToContent[tag.id].concat([item]) : [item];
      }
    });
  });

  return tagToContent;
}

//Returns a map of tagId to suggestions from the targeting api, filtering out non-atoms
function getTagToTargetAtoms(tags) {
  const tagToTargetAtoms = {};

  const fetch = (tag) => {
    return fetchTargetsForTag(tag)
      .then(targets => {
        const filtered = targets.filter(target => target.url.includes("/atom/"));
        if (filtered.length > 0) {
          tagToTargetAtoms[tag] = (tagToTargetAtoms[tag]) ? tagToTargetAtoms[tag].tag(filtered) : filtered;
        }
        return Promise.resolve();
      });
  };

  //Sequentially fetch targets for each tag
  return tags.reduce((p, tag) => p.then(() => fetch(tag)), Promise.resolve())
    .then(() => {
      return Promise.resolve(tagToTargetAtoms);
    });
}

//Returns a map of atom url to content, based on tagging
function getAtomUrlToContent(tagToContent, tagToTargetAtoms) {
  const atomUrlToContent = {};

  Object.keys(tagToTargetAtoms).map(tag => {
    tagToTargetAtoms[tag].map(target => {
      tagToContent[tag].map(content => {
        atomUrlToContent[target.url] =
          (atomUrlToContent[target.url]) ? atomUrlToContent[target.url].concat([content]) : [content];
      });
    });
  });

  return atomUrlToContent;
}

function getAtomFromTargetUrl(url) {
  // the path has the form: /atoms/<type>/<id>
  const tokens = url.split('/');
  const atomType = tokens[tokens.length-2];
  const atomId = tokens[tokens.length-1];

  return AtomsApi.getAtom(atomType, atomId)
    .then(res => res.json());
}

function resolveAtoms(atomUrlToContent) {
  return Promise.all(
    Object.keys(atomUrlToContent).map(atomUrl => {
      return getAtomFromTargetUrl(atomUrl).then(atom => {
        return {
          atom: atom,
          content: atomUrlToContent[atomUrl]
        };
      });
    })
  );
}

export const suggestedContentPropType = PropTypes.shape({
  atom: atomPropType.isRequired,
  content: {
    id: PropTypes.string.isRequired,
    headline: PropTypes.string.isRequired,
    internalComposerCode: PropTypes.string.isRequired,
    atoms: PropTypes.object.isRequired
  }
});

/**
 * Returns an array of suggestedContentPropType, which maps
 * an atom to its suggested content from the last 24 hours.
 */
export function getSuggestionsForLatestContent() {
  return dispatch => {
    dispatch(requestSuggestionsForLatestContent());

    return getLatestContent()
      .then(contentArray => {
        const tagToContent = buildTagToContent(contentArray);

        return getTagToTargetAtoms(Object.keys(tagToContent))
          .then(tagToTargetAtoms => getAtomUrlToContent(tagToContent, tagToTargetAtoms));
      })
      .then(atomUrlToContent => resolveAtoms(atomUrlToContent))
      .then(results => dispatch(receiveSuggestionsForLatestContent(results)))
      .catch(error => {
        dispatch(errorReceivingSuggestionsForLatestContent(error));
      });
  };
}