import React from 'react';
import {atomPropType} from '../../constants/atomPropType';
import {fetchTargetsForAtomPath, deleteTarget} from '../../services/TargetingApi';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

import CreateTargetForm from './CreateTargetForm';

class CurrentTargets extends React.Component {

  static propTypes = {
    atom: atomPropType,
  }

  state = {
    targets: [],
    fetching: false,
    editing: false
  }

  componentDidMount() {
    this.fetchTargets();
  }

  calculateAtomPath = () => {
    const atom = this.props.atom;
    return `/atom/${atom.atomType.toLowerCase()}/${atom.id}`;
  }

  fetchTargets = () => {
    this.setState({fetching: true});
    fetchTargetsForAtomPath(this.calculateAtomPath()).then((targets) => {
      this.setState({
        targets: targets,
        fetching: false
      });
    });
  }

  toggleEditMode = () => {
    this.setState({
      editing: !this.state.editing,
      currentTarget: {}
    });
  }

  deleteTarget = (target) => {
    deleteTarget(target.id).then(() => {
      this.fetchTargets();
    });
  }

  renderTarget = (target, i) => {
    return (
      <div className="targeting__target">
        <div className="targeting__target__title">
          Target {i + 1}
        </div>
        <a className="targeting__target__delete" onClick={this.deleteTarget.bind(this, target)}>
            <img className="targeting__target__delete"src="/assets/images/delete-icon.svg"/>
        </a>
        <ul className="targeting__target__tags">
          {target.tagPaths.map((tagPath) => <li key={tagPath}>{tagPath}</li>)}
        </ul>
        <div>Expires {distanceInWordsToNow(target.activeUntil, {addSuffix: true})} </div>
      </div>
    );
  }

  renderTargets() {
    if (this.state.fetching) {
      return <div>Fetching...</div>;
    }

    if (!this.state.targets || !this.state.targets.length) {
      return;
    }

    return (
      <div className="targeting__targets">
        {this.state.targets.map(this.renderTarget)}
      </div>
    );

  }

  render () {
    return (
      <div className="targeting">
        {this.renderTargets()}
        {this.state.editing ?
          <CreateTargetForm
            atomPath={this.calculateAtomPath()}
            triggerTargetFetch={this.fetchTargets}
            toggleEditMode={this.toggleEditMode}
            />
          :
          <button className="btn" onClick={this.toggleEditMode}>Create Target</button>
        }
      </div>
    );
  }
}

export default CurrentTargets;
