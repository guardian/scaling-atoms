import React, {PropTypes} from 'react';
import { errorPropType } from '../../constants/errorPropType';

export default class FormFieldArrayWrapper extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.array,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    onUpdateField: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ])
  }

  onAddClick = () => {
    const exisitingValues = this.props.fieldValue || [];
    this.props.onUpdateField(exisitingValues.concat([undefined]));
  }

  renderValue(value, i) {

    const updateFn = (newValue) => {
      //Find the value in the array to change
      const newFieldValue = this.props.fieldValue.map((oldValue) => {
        return value === oldValue ? newValue : oldValue;
      });
      this.props.onUpdateField(newFieldValue);
    };

    const removeFn = (removeIndex) => {
      const newFieldValue = this.props.fieldValue.filter((value, currentIndex) => {
        return currentIndex !== removeIndex;
      });

      this.props.onUpdateField(newFieldValue);
    };

    const hydratedChildren = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        fieldName: `${this.props.fieldName}-${i}`,
        fieldValue: value,
        fieldErrors: this.props.fieldErrors,
        onUpdateField: updateFn
      });
    });

    return (
      <div>
        {hydratedChildren}
        <button className="btn" onClick={removeFn.bind(this, i)}>Delete</button>
      </div>
    );
  }

  render () {
    return (
      <div>
        <h3>{this.props.fieldLabel}</h3>
        {this.props.fieldValue.map((value, i) => this.renderValue(value, i))}
        <button className="btn" onClick={this.onAddClick}>Add</button>
      </div>
    );
  }
}
