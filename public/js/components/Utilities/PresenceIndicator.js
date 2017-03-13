import React, {PropTypes} from 'react';

export default class PresenceIndicator extends React.Component {

  static propTypes = {
    presence: PropTypes.object
  }

  getInitials(firstName, lastName) {
    return `${firstName.slice(0, 1)}${lastName.slice(0,1)}`;
  }

  renderPresenceUser = (state) => {
    const user = state.clientId.person;
    return (
      <li key="state.clientId.connId" className="presence-list__user">{this.getInitials(user.firstName, user.lastName)}</li>
    );
  };

  renderPresenceUsers = () => {
    const statesOnThisArea = this.props.presence.currentState.filter((state) => state.location === 'document');
    return (
      <ul className="presence-list">
        {statesOnThisArea.map(this.renderPresenceUser)}
      </ul>
    );
  };

  render() {
    return (
      <div>
        {this.renderPresenceUsers()}
      </div>
    );
  }
}
