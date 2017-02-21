import React from 'react';
import {AtomTypePropType} from '../../constants/atomData';

export const AtomTypeCard = (props) => (
  <div className="atom-card" key={props.atomType.type}>
    <div className="atom-card__icon">
      <img src={`/assets/images/typeicons/${props.atomType.type}-icon.svg`} />
    </div>
    <div className="atom-card__details">
      <h3 className="atom-card__heading">{props.atomType.fullName}</h3>
      <p className="atom-card__description">{props.atomType.description}</p>
    </div>
  </div>
);


AtomTypeCard.propTypes = {
  atomType: AtomTypePropType
};
