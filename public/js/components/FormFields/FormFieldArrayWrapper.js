import React, {PropTypes} from 'react';
import { errorPropType } from '../../constants/errorPropType';

export default class FormFieldArrayWrapper extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.array,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    onUpdateField: PropTypes.func,
    nested: PropTypes.bool,
    numbered: PropTypes.bool,
    fieldClass: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ])
  }

  //We store new items in state to avoid sending invalid items back to the server before they're ready
  state = {
    newItems: []
  }

  onAddClick = () => {
    this.setState({
      newItems: this.state.newItems.concat([undefined])
    });
  }

  renderValue(value, i) {

    const updateFn = (newValue) => {
      if (value === undefined) {
        //It's the first update to a new item - add it to props and remove from newItems
        this.setState({
          newItems: this.state.newItems.length > 1 ? this.state.newItems.slice(1) : []
        });

        const update = this.props.fieldValue ? this.props.fieldValue.concat([newValue]) : [newValue];
        this.props.onUpdateField(update);
      } else {
        //Find the value in the array to change
        const newFieldValue = this.props.fieldValue.map((oldValue) => {
          return value === oldValue ? newValue : oldValue;
        });

        this.props.onUpdateField(newFieldValue);
      }
    };

    const removeFn = (removeIndex) => {
      if (this.props.fieldValue && this.props.fieldValue.length > removeIndex) {
        const newFieldValue = this.props.fieldValue.filter((value, currentIndex) => {
          return currentIndex !== removeIndex;
        });

        this.props.onUpdateField(newFieldValue);
      } else {
        //It must be a new item
        this.setState({
          newItems: this.state.newItems.length > 1 ? this.state.newItems.slice(1) : []
        });
      }
    };

    const hydratedChildren = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        key: `${this.props.fieldName}-${i}`,
        fieldName: `${this.props.fieldName}-${i}`,
        fieldValue: value,
        fieldErrors: this.props.fieldErrors,
        formRowClass: 'form__row form__row--flex',
        onUpdateField: updateFn
      });
    });

    return (
      <div className={this.props.fieldClass ? this.props.fieldClass : 'form__group form__field'}>
        {this.props.numbered ? <span className="form__field-number">{`${i + 1}. `}</span> : false }
        {hydratedChildren}
        <button className="btn form__field-btn btn--red" type="button" onClick={removeFn.bind(this, i)}>Delete</button>
      </div>
    );
  }

  render () {
   const values = (this.props.fieldValue || []).concat(this.state.newItems);

    return (
      <div className={this.props.nested ? 'form__row form__row--nested' : 'form__row'}>
        <div className="form__btn-heading">
          <span className="form__label">{this.props.fieldLabel}</span>
       </div>
          {values.map((value, i) => this.renderValue(value, i))}
        <button className="form__btn-heading__btn form__btn-heading__add" type="button" onClick={this.onAddClick}>Add</button>
      </div>
    );
  }
}
