import React, {PropTypes} from 'react';

export const ManagedForm = (props) => {
  const hydratedChildren = React.Children.map(props.children, (child) => {
    return React.cloneElement(child, {
      data: props.data,
      updateData: props.updateData
    });
  });
  return <form className="form">{hydratedChildren}</form>;
};

ManagedForm.propTypes = {
  updateData: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ])
};
