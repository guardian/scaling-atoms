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
        formRowClass: 'form__row--flex-width',
        onUpdateField: updateFn
      });
    });

    return (
      <div className="form__row form__row--field-with-btn">
        {hydratedChildren}
        <button className="btn form__field-btn" type="button" onClick={removeFn.bind(this, i)}>Delete</button>
      </div>
    );
  }

  render () {

    const values = this.props.fieldValue || [];

    return (
      <div className="form__row">
        <h3 className="form__subheading">{this.props.fieldLabel}</h3>
        {values.map((value, i) => this.renderValue(value, i))}
        <button className="btn" type="button" onClick={this.onAddClick}>Add</button>
      </div>
    );
  }
}
