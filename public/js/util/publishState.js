const publishState = (atom) => {
  // @TODO - Add "Taken down" state when the API returns a taken down time
  if (atom.contentChangeDetails.published) {
    if (atom.contentChangeDetails.published.date == atom.contentChangeDetails.lastModified.date) {
      return {
        id: 'published',
        text: 'Published'
      };
    }
    return {
      id: 'unpublished-changes',
      text: 'Unpublished changes'
    };
  }

  return {
    id: 'draft',
    text: 'Draft'
  };
};

export default publishState;
