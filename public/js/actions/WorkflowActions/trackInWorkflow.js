import WorkflowApi from '../../services/WorkflowApi';
import {logError} from '../../util/logger';

function requestTrackInWorkflow(atomType, id) {
  return {
    type:       'WORKFLOW_TRACK_GET_REQUEST',
    atomType:   atomType,
    id:         id,
    receivedAt: Date.now()
  };
}

function receiveTrackInWorkflow(data) {
  return {
    type:       'WORKFLOW_TRACK_GET_RECEIVE',
    data:       data,
    receivedAt: Date.now()
  };
}

function errorReceivingTrackInWorkflow(error) {
  logError(error);
  return {
    type:       'SHOW_ERROR',
    message:    'Could not track atom in workflow',
    error:      error,
    receivedAt: Date.now()
  };
}

export function trackInWorkflow(atom, section, scheduledLaunchDate) {
  return dispatch => {
    dispatch(requestTrackInWorkflow(atom.atomType, atom.id));
    return WorkflowApi.trackInWorkflow(atom, section, scheduledLaunchDate, 'Writers')
    .then(res => res.json())
    .then(atom => {
      dispatch(receiveTrackInWorkflow(atom));
    })
    .catch(error => dispatch(errorReceivingTrackInWorkflow(error)));
  };
}
