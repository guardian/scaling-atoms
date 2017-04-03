import React, {PropTypes} from 'react';

export default class SearchTextInput extends React.Component {


  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.string,
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func
  };

  onUpdate = (e) => {
    this.props.onUpdateField(e.target.value);
  }

  render() {
    return (
        <div className="atom-search__row">
          <label htmlFor={this.props.fieldName} className="visually-hidden">{this.props.fieldLabel}</label>
          <input type="search" className="atom-search__input"  id={this.props.fieldName} placeholder={this.props.fieldPlaceholder || ''} onChange={this.onUpdate}  value={this.props.fieldValue || ""}/>
        </div>

    );
  }
}
