import React from 'react';
import {Link} from 'react-router';

export default class Header extends React.Component {

  render () {
    return (
        <div className="toolbar">

          <header className="toolbar__container">
            <Link className="toolbar__title" href="/">
              <div className="toolbar__logo"></div>
              <div className="toolbar__page-icon"></div>
              <div className="toolbar__title__hover-state">
                <span className="toolbar__title__hover-state__subtitle">Back to</span><br />
                <span className="toolbar__title__hover-state__title">Dashboard</span>
              </div>
            </Link>
          </header>
          
        </div>
    );
  }
}
