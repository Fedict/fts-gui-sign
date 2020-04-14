import { navigateToStep } from "./WizardActions"
import { WIZARD_STATE_PIN_INPUT } from "../wizard/WizardConstants"

export const PIN_ERROR_SET_ERROR = "PIN_ERROR_SET_ERROR"
export const showPinError = (message) => (dispatch, getStore) => {
    dispatch({ type: PIN_ERROR_SET_ERROR, payload: message })
    dispatch(navigateToStep(WIZARD_STATE_PIN_INPUT))
}

export const pinErrorLength = {}
export const pinError3AttemptsLeft = {}
export const pinError2AttemptsLeft = {}
export const pinError1AttemptsLeft = {}
export const pinError1AttemptsLeft = {}