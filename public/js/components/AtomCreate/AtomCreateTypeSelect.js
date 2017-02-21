import React from 'react';
import {Link} from 'react-router';

import {allAtomTypes} from '../../constants/atomData';
import {AtomTypeCard} from '../AtomTypeCard/AtomTypeCard';


export class AtomCreateTypeSelect extends React.Component {

  render () {
    return (
      <div className="create">
        <h2>Create an Atom</h2>
        <div className="create__cards">
          {allAtomTypes.map((atomType) => (
            <Link to={`/create/${atomType.type}`} className="create__link" key={atomType.type}>
              <AtomTypeCard atomType={atomType} />
            </Link>
          ))}
        </div>
      </div>
    );
  }
}
