export default function formErrors(state = {}, action) {

  switch (action.type) {
    /* eslint-disable no-case-declarations */
    case 'FORM_ERRORS_UPDATE_REQUEST':
      const formName = Object.keys(action.error)[0];
      const newFormErrors = action.error[formName];
      const currentFormErrors = state[formName] || {};
      const updatedFormErrors = Object.assign({}, currentFormErrors, newFormErrors);
      const updatedForm = {[formName]: updatedFormErrors};
      return Object.assign({}, state, updatedForm);
    /* eslint-enable no-case-declarations */

    default:
      return state;
  }
}
