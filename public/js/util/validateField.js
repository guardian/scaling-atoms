import FieldError from '../constants/FieldError';
import {logError} from './logger';

const validateField = (fieldValue, isRequired: false, customValidation) => {
  const errors = [];

  const checkError = (err) => {
    if (!(err instanceof FieldError) && err !== true) {
      logError('Invalid error format', err);
      throw err;
    }
    return err !== true ? err : false;
  };

  // isRequired check
  if(isRequired && !fieldValue) {
    const error = new FieldError('required', 'This field is required');
    errors.push(error);
  }

  // Custom validators
  if(customValidation) {
    const customValidationResults = customValidation.map((validator) => validator(fieldValue));

    return Promise.all(customValidationResults)
      .then(res => res.filter(checkError))
      .then(customErrors => Promise.resolve(errors.concat(customErrors)))
      .catch(err => logError('Validation error', err));
  }

  return Promise.resolve(errors);
};

export default validateField;
