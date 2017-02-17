import React from 'react';
import FormFieldCheckboxGroup from './FormFieldCheckboxGroup';
import renderer from 'react-test-renderer';

let fieldLabel = 'test',
    fieldName = 'test',
    fieldValue = ['one', 'two'],
    checkValues = ['one', 'two', 'three'];

test('Should render', () => {

  const updateFn = jest.fn();
  const component = renderer.create(
    <FormFieldCheckboxGroup fieldLabel={fieldLabel} fieldName={fieldName} fieldValue={fieldValue} checkValues={checkValues} onUpdateField={updateFn} />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
