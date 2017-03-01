import React, {PropTypes} from 'react';
import ShowErrors from '../Utilities/ShowErrors';
import { errorPropType } from '../../constants/errorPropType';
import {searchTags} from '../../services/capi';

export default class FormFieldTagPicker extends React.Component {


  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.string,
    fieldPlaceholder: PropTypes.string,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    formRowClass: PropTypes.string,
    onUpdateField: PropTypes.func
  };

  state = {
    suggestions: null,
    searchText: ""
  };

  selectTag = (id) => {
    this.props.onUpdateField(id);

    this.setState({
      suggestions: null,
      searchText: ""
    });
  }

  resetTag = () => {
    this.props.onUpdateField(undefined);
  }

  updateSearchSuggestions = (e) => {

    const searchText = e.target.value;

    this.setState({
      searchText: searchText
    });

    searchTags(searchText).then((results) => {
      this.setState({
        suggestions: results
      });
    })
    .catch(() => {
      this.setState({
        suggestions: null
      });
    });

  }

  renderSuggestions() {
    if (!this.state.suggestions) {
      return false;
    }

    if (!this.state.suggestions.length) {
      return <div>No tags found</div>;
    }

    return this.state.suggestions.map((suggestion) => {

      const updateFn = () => {
        this.selectTag(suggestion.id);
      };

      return (
        <div>
          <a onClick={updateFn}>{suggestion.id}</a>
        </div>
      );
    });
  }

  render() {

    if (this.props.fieldValue) {
      return (
        <div className={this.props.formRowClass || "form__row"}>
          {this.props.fieldLabel ? <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label> : false}
          <input className="form__field" value={this.props.fieldValue} disabled={true} />
          <a onClick={this.resetTag}>Change Tag</a>
        </div>
      );
    }

    return (
        <div className={this.props.formRowClass || "form__row"}>
          {this.props.fieldLabel ? <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label> : false}
          <input
            type="text"
            className={"form__field " + (this.props.fieldErrors && this.props.fieldErrors.length ? "form__field--error" : "")}
            id={this.props.fieldName}
            onChange={this.updateSearchSuggestions}
            value={this.state.searchText}
            />
          {this.renderSuggestions()}
          <ShowErrors errors={this.props.fieldErrors}/>
        </div>
    );
  }
}
