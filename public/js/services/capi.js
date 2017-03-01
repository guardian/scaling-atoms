export function searchTags(seachText) {
  return fetch(
    `/support/previewCapi/tags?q=${seachText}`,
    {
      method: 'get',
      credentials: 'same-origin'
    }
  )
  .then((res) => res.json())
  .then((json) => Promise.resolve(json.response.results));
}
