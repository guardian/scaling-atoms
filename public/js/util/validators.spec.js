import {isHttpsUrl} from './validators';

test('Should validate as HTTPS URL', () => {
  let url = 'https://example.com';

  return isHttpsUrl(url).then(res => {
     expect(res).toBe(true);
  });
});

test('Should return an error', () => {
  let url = 'wrong';

  return isHttpsUrl(url).then(res => {
    expect(res.title).toBe('not-https');
  });
});
