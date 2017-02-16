import { PropTypes } from 'react';

export const errorPropType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
});
