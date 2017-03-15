const fakeStore = {
  getState: function() {
    return {
      config: {
        atomEditorGutoolsDomain: "test.dev-gutools.co.uk"
      }
    };
  }
};

export function getStore() {
  return fakeStore;
}
