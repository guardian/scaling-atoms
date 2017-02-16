import { PropTypes } from 'react';

export const errorPropType = PropTypes.shape({
  error: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
});
