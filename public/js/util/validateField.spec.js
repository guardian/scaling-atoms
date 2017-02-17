import validateField from './validateField';

test('Should return no errors', () => {
  let fieldValue = 'test',
      isRequired = false,
      customValidation = [];

  return validateField(fieldValue, isRequired, customValidation)
    .then(res => {
      expect(Array.isArray(res) && res.length === 0).toBe(true);
    });
});

test('Should return \"required\" error', () => {
  let fieldValue = '',
      isRequired = true,
      customValidation = [];

    return validateField(fieldValue, isRequired, customValidation)
      .then(res => {
        expect(res[0].title).toBe('required');
      });
});
