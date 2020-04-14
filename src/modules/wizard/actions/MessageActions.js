import { navigateToStep } from "../actions/WizardActions"
import { WIZARD_STATE_MESSAGE } from "../wizard/WizardConstants"


export const MESSAGE_SET_ERROR = "MESSAGE_SET_ERROR"
export const MESSAGE_SET_INFO = "MESSAGE_SET_INFO"


export const showErrorMessage = (message) => (dispatch, getStore) => {
    dispatch({ type: MESSAGE_SET_ERROR, payload: message })
    dispatch(navigateToStep(WIZARD_STATE_MESSAGE))
}

export const showInfoMessage = (message) => (dispatch, getStore) => {
    dispatch({ type: MESSAGE_SET_INFO, payload: message })
    dispatch(navigateToStep(WIZARD_STATE_MESSAGE))
}
