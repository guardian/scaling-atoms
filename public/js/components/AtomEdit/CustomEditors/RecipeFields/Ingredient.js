import React, { PropTypes } from 'react';
import {ManagedForm, ManagedField} from '../../../ManagedEditor';
import FormFieldTextInput from '../../../FormFields/FormFieldTextInput';
import FormFieldNumericInput from '../../../FormFields/FormFieldNumericInput';

export class Ingredient extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.shape({
      item: PropTypes.string,
      comment: PropTypes.string,
      quantity: PropTypes.number,
      quantityRange: PropTypes.shape({
        from: PropTypes.number,
        to: PropTypes.number
      }),
      unit: PropTypes.string
    }),
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func
  };

  updateQuantity = (newQuantity, newQuantityRange) => {
    this.props.onUpdateField(Object.assign({}, this.props.fieldValue, {
      quantity: newQuantity,
      quantityRange: newQuantityRange
    }));
  }

  render () {
    return (
      <ManagedForm data={this.props.fieldValue} updateData={this.props.onUpdateField}>
        <ManagedField fieldLocation="item" name="Ingredient Name">
          <FormFieldTextInput />
        </ManagedField>
        <ManagedField fieldLocation="comment" name="Comment">
          <FormFieldTextInput />
        </ManagedField>
        <Quantity
          quantity={this.props.fieldValue && this.props.fieldValue.quantity}
          quantityRange={this.props.fieldValue && this.props.fieldValue.quantityRange}
          updateQuantity={this.updateQuantity}
          />
      </ManagedForm>
    );
  }
}


class Quantity extends React.Component {

  static propTypes = {
    quantity: PropTypes.number,
    quantityRange: PropTypes.shape({
      from: PropTypes.number,
      to: PropTypes.number
    }),
    updateQuantity: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isRange: !props.quantityRange
    };
  }

  toggleRange = () => {
    this.setState({
      isRange: !this.state.isRange
    });

    //Reset Quantity and do the right thing with the current value
    if (this.props.quantity) { // We have an absolute... copy to from
      this.props.updateQuantity(undefined, {
        from: this.props.quantity
      });
    } else if (this.props.quantityRange && this.props.quantityRange.from) {
      // we have a from, copy to absolute
      this.props.updateQuantity(this.props.quantityRange.from, undefined);
    } else {
      this.props.updateQuantity(undefined, undefined);
    }
  }

  updateFrom = (value) => {
    const newRange = Object.assign({}, this.props.quantityRange, {
      from: value
    });
    this.props.updateQuantity(undefined, newRange);
  }

  updateTo = (value) => {
    const newRange = Object.assign({}, this.props.quantityRange, {
      to: value
    });
    this.props.updateQuantity(undefined, newRange);
  }

  updateAbsoluteQuantity = (value) => {
    this.props.updateQuantity(value, undefined);
  }


  renderRange() {
    return (
      <div>
        <FormFieldNumericInput
          fieldLabel="from"
          fieldValue={this.props.quantityRange && this.props.quantityRange.from}
          onUpdateField={this.updateFrom}/>
        <FormFieldNumericInput
          fieldLabel="to"
          fieldValue={this.props.quantityRange && this.props.quantityRange.to}
          onUpdateField={this.updateTo}/>
      </div>
    );
  }

  renderNonRange() {
    return (
      <div>
        <FormFieldNumericInput
          fieldLabel="quantity"
          fieldValue={this.props.quantity}
          onUpdateField={this.updateAbsoluteQuantity}/>
      </div>
    );
  }

  render () {
    return (
      <div className="form__group form__group--checkbox">
        <input className="form__checkbox" type="checkbox" checked={this.state.isRange} onChange={this.toggleRange} />
        <span className="form__label form__label--checkbox">Range?</span>
        {this.state.isRange ? this.renderRange() : this.renderNonRange()}
      </div>
    );
  }
}
