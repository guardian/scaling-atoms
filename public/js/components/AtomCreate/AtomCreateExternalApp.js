import React from 'react';
import {Link} from 'react-router';
import {AtomTypePropType, getCreateUrlFromAtomType} from '../../constants/atomData';
import {AtomTypeCard} from '../AtomTypeCard/AtomTypeCard';

class AtomCreateExternalApp extends React.Component {

  static propTypes = {
    atomType: AtomTypePropType
  }

  render () {
    return (
      <div className="atom-editor">
        <h1 className="atom-editor__title">{`Create new ${this.props.atomType.name}`}</h1>
        <div className="atom-editor__section">
          <AtomTypeCard atomType={this.props.atomType} />
          <Link className="link" to="/create">Select different atom</Link>
        </div>
        <div>This atom cannot be created from within the Atom Workshop. It has its own dedicated editor</div>
        <h3><a href={getCreateUrlFromAtomType(this.props.atomType)}>Open Dedicated Editor</a></h3>
      </div>
    );
  }
}

export default AtomCreateExternalApp;
