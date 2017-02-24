const publishState = (atom) => {
  // @TODO - Add "Taken down" state when the API returns a taken down time
  if (atom.contentChangeDetails.published) {
    return(atom.contentChangeDetails.published == atom.contentChangeDetails.lastModified ? 'published' : 'unpublished changes');
  }

  return 'draft';
};

export default publishState;
