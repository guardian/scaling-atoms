import React from 'react';
import {Link} from 'react-router';

export default class BrowseHeader extends React.Component {

  render() {
    return (
      <div className="toolbar__container">
        <Link to="/create" className="toolbar__button">Create New Atom</Link>
      </div>
    );
  }
}
