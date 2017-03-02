import {saveStateVals} from '../constants/saveStateVals';

export default function saveState(state = {
  saving: false,
  publishing: false
}, action) {

  switch (action.type) {
    //Save States
    case 'ATOM_GET_REQUEST':
      return Object.assign({}, state, {
        saving: saveStateVals.inprogress
      });

    case 'ATOM_CREATE_REQUEST':
      return Object.assign({}, state, {
        saving: saveStateVals.inprogress
      });

    case 'ATOM_UPDATE_REQUEST':
      return Object.assign({}, state, {
        saving: saveStateVals.inprogress
      });

    case 'ATOM_TAKE_DOWN_REQUEST':
      return Object.assign({}, state, {
        saving: saveStateVals.inprogress
      });

    case 'ATOM_GET_RECEIVE':
      return Object.assign({}, state, {
        saving: false
      });

    case 'ATOM_CREATE_RECEIVE':
      return Object.assign({}, state, {
        saving: false
      });

    case 'ATOM_UPDATE_RECEIVE':
      return Object.assign({}, state, {
        saving: false
      });

    case 'ATOM_TAKE_DOWN_RECEIVE':
      return Object.assign({}, state, {
        saving: false
      });

    case 'SHOW_ERROR':
      return Object.assign({}, state, {
        saving: false
      });


    //Publish States
    case 'ATOM_PUBLISH_REQUEST':
      return Object.assign({}, state, {
        publishing: saveStateVals.inprogress
      });

    case 'ATOM_PUBLISH_RECEIVE':
      return Object.assign({}, state, {
        publishing: false
      });

    default:
      return state;
  }
}
