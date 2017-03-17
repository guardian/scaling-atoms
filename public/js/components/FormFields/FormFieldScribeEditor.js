import React, {PropTypes} from 'react';
import Scribe from 'scribe';
import scribeKeyboardShortcutsPlugin from 'scribe-plugin-keyboard-shortcuts';
import scribePluginToolbar from 'scribe-plugin-toolbar';
import scribePluginLinkPromptCommand from 'scribe-plugin-link-prompt-command';
import scribePluginSanitizer from 'scribe-plugin-sanitizer';
import {errorPropType} from '../../constants/errorPropType';
import ShowErrors from '../Utilities/ShowErrors';

export default class FormFieldsScribeEditor extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.string,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    formRowClass: PropTypes.string,
    onUpdateField: PropTypes.func,
    showWordCount: PropTypes.bool,
    suggestedLength: PropTypes.number
  }

  state = {
    wordCount: 0
  }

  wordCount = (text) => text.trim().replace(/<(?:.|\n)*?>/gm, '').split(/\s+/).length;
  
  tooLong = (wordCount) => this.props.suggestedLength && wordCount > this.props.suggestedLength;

  render () {
    const wordCount = this.wordCount(this.props.fieldValue);
    return (
        <div className={(this.props.formRowClass || "form__row") + " scribe"}>
          {this.props.fieldLabel ? <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label> : false}
          <ScribeEditor fieldName={this.props.fieldName} value={this.props.fieldValue} onUpdate={this.props.onUpdateField}/>
          {this.props.showWordCount ? <span className="form__word-count form__message__text">{wordCount} words</span> : false}
          {this.tooLong(wordCount) ? <span className="form__message__text--error">(too long)</span>: false}
          <ShowErrors errors={this.props.fieldErrors}/>
        </div>
    );
  }
}

FormFieldsScribeEditor.defaultProps = {
  showWordCount: false
}

export class ScribeEditor extends React.Component {

  static propTypes = {
    fieldName: PropTypes.string,
    value: PropTypes.string
  }

  componentDidMount() {
    this.scribe = new Scribe(this.refs.editor);

    this.configureScribe();

    this.scribe.on('content-changed', this.onContentChange);
  }

  configureScribe() {
    // Create an instance of the Scribe toolbar
    this.scribe.use(scribePluginToolbar(this.refs.toolbar));

    // Configure Scribe plugins
    this.scribe.use(scribePluginLinkPromptCommand());
    this.scribe.use(scribeKeyboardShortcutsPlugin({
      bold: function (event) { return event.metaKey && event.keyCode === 66; }, // b
      italic: function (event) { return event.metaKey && event.keyCode === 73; }, // i
      linkPrompt: function (event) { return event.metaKey && !event.shiftKey && event.keyCode === 75; }, // k
      unlink: function (event) { return event.metaKey && event.shiftKey && event.keyCode === 75; } // shft + k
    }));

    this.scribe.use(scribePluginSanitizer({
      tags: {
        p: {},
        i: {},
        b: {},
        a: {
          href: true
        },
        ul: {},
        ol: {},
        li: {}
      }
    }));

  }

  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.refs.editor.innerHTML;
  }

  onContentChange = () => {
    const newContent = this.refs.editor.innerHTML;
    if (newContent !== this.props.value) {
      this.props.onUpdate(newContent);
    }
  }

  render() {
    return (
        <div>
        <div ref="toolbar" className="scribe__toolbar">
          <button type="button" data-command-name="bold" className="scribe__toolbar__item">Bold</button>
          <button type="button" data-command-name="italic" className="scribe__toolbar__item">Italic</button>
          <button type="button" data-command-name="linkPrompt" className="scribe__toolbar__item">Link</button>
          <button type="button" data-command-name="unlink" className="scribe__toolbar__item">Unlink</button>
        </div>
        <div id={this.props.fieldName} dangerouslySetInnerHTML={{__html: this.props.value}} ref="editor" className="scribe__editor"></div>
        </div>
  )
  }
}
