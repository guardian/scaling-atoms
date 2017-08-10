import {getContentByTags} from '../../services/capi';
import {fetchTargetsForAtomPath} from '../../services/TargetingApi';
import {logError} from '../../util/logger';


function requestSuggestedContent(atomType, id) {
  return {
    type:       'SUGGESTED_CONTENT_GET_REQUEST',
    atomType:   atomType,
    id:         id,
    receivedAt: Date.now()
  };
}

function receiveSuggestedContent(suggestedContent) {
  return {
    type:       'SUGGESTED_CONTENT_GET_RECEIVE',
    suggestedContent: suggestedContent,
    receivedAt: Date.now()
  };
}

function errorReceivingSuggestedContent(error) {
  logError(error);
  return {
    type:       'SHOW_ERROR',
    message:    'Could not get suggested content for atom',
    error:      error,
    receivedAt: Date.now()
  };
}

/**
 * Gets tags from Target api.
 * Queries capi for content with those tags, filtering out
 * any content which already have this atom.
 */
export function getSuggestedContent(atomId, atomType) {
  const path = `/atom/${atomType.toLowerCase()}/${atomId}`;
  const pluralType = `${atomType}s`;

  return dispatch => {
    dispatch(requestSuggestedContent(atomType, atomId));
    return fetchTargetsForAtomPath(path)
      .then((targets) => {
        return targets.map((target) => {
          return target.tagPaths;
        });
      })
      .then(tags => getContentByTags(tags, pluralType))
      .then(content => {
        //Exclude any content with this atom
        const suggested = content.filter(c => {
          if (c.atoms && c.atoms[pluralType]) {
            const atomIdx = c.atoms[pluralType].find(a => {
              return a.id === atomId;
            });
            return atomIdx === -1;
          } else {
            return true;
          }
        });

        suggested.sort((first, second) => new Date(second.fields.creationDate) - new Date(first.fields.creationDate));

        dispatch(receiveSuggestedContent(suggested));
      })
      .catch(error => {
        dispatch(errorReceivingSuggestedContent(error));
      });
  };
}
