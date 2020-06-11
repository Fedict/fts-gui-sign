
export const WIZARD_CHANGE_STATE = "WIZARD_CHANGE_STATE"
export const navigateToStep = (route) => {
    return { type: WIZARD_CHANGE_STATE, payload: route }
}

