import React, {PropTypes} from 'react';
import { getStore } from '../../util/storeAccessor';

export default class DeleteAtom extends React.Component {
  static propTypes = {
    atom: PropTypes.object.isRequired,
    deleteAtom: PropTypes.func.isRequired
  };

  // the permissions are also validated on the server-side for each request
  permissions = getStore().getState().config.permissions;
  showActions = this.permissions.deleteAtom;

  state = { deleteDoubleCheck: false };

  renderDelete() {
    if (!this.permissions.deleteAtom) {
      return false;
    }

    const deleteMsg = this.state.deleteDoubleCheck
      ? 'Confirm delete from database'
      : 'Delete from database';

    const doDelete = () => {
      if (this.state.deleteDoubleCheck) {
        this.props.deleteAtom(this.props.atom);
      } else {
        this.setState({ deleteDoubleCheck: true });
      }
    };

    return (
      <li className="action-list__item">
          <button
            className="btn label__expired action-list__button"
            onClick={doDelete}
          >
            {deleteMsg}
          </button>
      </li>
    );
  }

  render() {
    if (!this.showActions) {
      return false;
    }

    return (
      <div>
        <ul className="action-list">
          {this.renderDelete()}
        </ul>
      </div>
    );
  }
}
