import WorkflowApi from '../../services/WorkflowApi';
import {logError} from '../../util/logger';
import {WorkflowStatus} from '../../constants/workflow';


function requestWorkflowStatus() {
  return {
    type:       'WORKFLOW_STATUS_GET_REQUEST',
    receivedAt: Date.now()
  };
}

function receiveWorkflowStatus(status) {
  return {
    type:       'WORKFLOW_STATUS_GET_RECEIVE',
    receivedAt: Date.now(),
    status:     status
  };
}

function errorReceivingWorkflowStatus(error) {
  logError(error);
  return {
    type:       'SHOW_ERROR',
    message:    'Could not get workflow statuses',
    error:      error,
    receivedAt: Date.now()
  };
}

function receiveStatus404() {
  return {
    type: 'WORKFLOW_STATUS_GET_RECEIVE',
    receivedAt: Date.now(),
    status: WorkflowStatus.notInWorkflow
  };
}

export function getWorkflowStatus(atom) {
  return dispatch => {
    dispatch(requestWorkflowStatus());
    return WorkflowApi.getWorkflowStatus(atom)
    .then(response => {
      dispatch(receiveWorkflowStatus(response.data));
    })
    .catch(error => {
      if (error.status ===  404) {
        return dispatch(receiveStatus404());
      }
      return dispatch(errorReceivingWorkflowStatus(error));
    });
  };
}
