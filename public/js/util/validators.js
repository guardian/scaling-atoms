import FieldError from '../constants/fieldError';
/**
 *
 * Validator should return a promise resolved with true for a pass and a new FieldError('error', 'message') if false
 *
 **/


export const isHttpsUrl = (value) => {
  const stringValue = typeof value === 'string' ? value : '';
  if (stringValue.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) {
    return Promise.resolve(true);
  } else {
    const error = new FieldError('not-https', 'Not a HTTPS url');
    return Promise.resolve(error);
  }
};
