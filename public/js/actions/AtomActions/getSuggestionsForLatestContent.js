import {getTagsForContent} from '../../services/capi';
import {mostViewed} from '../../services/ophan';
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

const distinct = array => array.filter((value, index, self) => self.indexOf(value) === index);
const flatten = array => [].concat.apply([], array);

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
function getTagToTargetUrls(tags) {
  const tagToTargetAtoms = {};

  const fetch = (tag) => {
    return fetchTargetsForTag(tag)
      .then(targets => {
        const filtered = targets.filter(target => target.url.includes("/atom/"));
        const urls = filtered.map(target => target.url);
        if (filtered.length > 0) {
          tagToTargetAtoms[tag] = (tagToTargetAtoms[tag]) ? tagToTargetAtoms[tag].tag(urls) : urls;
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

//Deduplicate the targeting urls and retrieve the atoms
function getAtomUrlToAtom(tagToUrls) {
  const atomUrlToAtom = {};

  const atomUrls = distinct(flatten(Object.keys(tagToUrls).map(tag => tagToUrls[tag])));

  return Promise.all(atomUrls.map(getAtomFromTargetUrl))
    .then(atoms => {
      atoms.forEach(atom => atomUrlToAtom[atom.url] = atom);
      return atomUrlToAtom
    });
}

function getAtomFromTargetUrl(url) {
  // the path has the form: /atoms/<type>/<id>
  const tokens = url.split('/');
  const atomType = tokens[tokens.length-2];
  const atomId = tokens[tokens.length-1];

  return AtomsApi.getAtom(atomType, atomId)
    .then(res => res.json()).then(atom => {
      atom.url = url;
      return atom;
    });
}

function resolveAtomsForContent(contentList, tagToUrls, urlToAtom) {
  return contentList.map(content => {
    const urls = content.tags
      .filter(tag => tag.type === "keyword")
      .map(tag => tagToUrls[tag.id])
      .filter(url => url !== undefined);

    const atoms = distinct(flatten(urls)).map(url => urlToAtom[url]);
    return {
      contentId: content.id,
      headline: content.fields.headline,
      internalComposerCode: content.fields.internalComposerCode,
      atoms: atoms
    }
  });
}

export const SuggestedAtomsPropType = PropTypes.shape({
  contentId: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  internalComposerCode: PropTypes.string.isRequired,
  atoms: PropTypes.arrayOf(atomPropType).isRequired
});

const skipChars = "https://www.theguardian.com/".length;

/**
 * Returns an array of SuggestedAtomsPropType, which maps content
 * to suggested snippet atoms.
 * The content is taken from ophan's most-viewed list.
 */
export function getSuggestionsForLatestContent() {
  return dispatch => {
    dispatch(requestSuggestionsForLatestContent());

    return mostViewed()
      .then(mostViewedContent =>
        Promise.all(mostViewedContent.map(content => getTagsForContent(content.url.slice(skipChars))))
      )
      //Filter out any articles that already contain a snippet atom
      .then(contentArray => contentArray.filter(content => !content.atoms || content.atoms.length === 0))
      .then(contentArray => {
        const tagToContent = buildTagToContent(contentArray);

        const tagToUrlsPromise = getTagToTargetUrls(Object.keys(tagToContent));
        const urlToAtomPromise = tagToUrlsPromise.then(getAtomUrlToAtom);

        return Promise.all([tagToUrlsPromise, urlToAtomPromise])
          .then(([tagToUrls, urlToAtom]) => resolveAtomsForContent(contentArray, tagToUrls, urlToAtom))
      })
      .then(results => dispatch(receiveSuggestionsForLatestContent(results)))
      .catch(error => {
        dispatch(errorReceivingSuggestionsForLatestContent(error));
      });
  };
}
