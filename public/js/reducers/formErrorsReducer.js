export default function formErrors(state = {}, action) {
  
  const formName = Object.keys(action.error)[0];
  const newFormErrors = action.error[formName];
  const currentFormErrors = state[formName] || {};
  const updatedFormErrors = Object.assign({}, currentFormErrors, newFormErrors);
  const updatedForm = {[formName]: updatedFormErrors};

  switch (action.type) {
    case 'FORM_ERRORS_UPDATE_REQUEST':
      return Object.assign({}, state, updatedForm);

    default:
      return state;
  }
}
