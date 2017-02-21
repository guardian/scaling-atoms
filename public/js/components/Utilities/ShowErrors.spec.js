import React from 'react';
import ShowErrors from './ShowErrors';
import renderer from 'react-test-renderer';

let errors = [
  {
    title: 'test',
    message: 'This is a test'
  },
  {
    title: 'test2',
    message: 'This is a test'
  },
];

test('it should render', () => {
  const component = renderer.create(
    <ShowErrors errors={errors} />
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
