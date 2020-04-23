import {
    WIZARD_STATE_UPLOAD,
    WIZARD_STATE_VERSION_CHECK_LOADING
} from "../wizard/WizardConstants"

export const WIZARD_CHANGE_STATE = "WIZARD_CHANGE_STATE"

export const navigateToVersionCheckLoading = () => (dispatch, getstate) => {
    dispatch({ type: WIZARD_CHANGE_STATE, payload: WIZARD_STATE_VERSION_CHECK_LOADING })
}


export const navigateToStep = (route) => (dispatch, getstate) => {
    const store = getstate()
    dispatch({ type: WIZARD_CHANGE_STATE, payload: route })

}