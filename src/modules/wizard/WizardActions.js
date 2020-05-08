
export const WIZARD_CHANGE_STATE = "WIZARD_CHANGE_STATE"
export const navigateToStep = (route) => (dispatch) => {
    dispatch({ type: WIZARD_CHANGE_STATE, payload: route })
}

export const WIZARD_RESET_FLOW_ID = "WIZARD_RESET_FLOW_ID"
export const setNewFlowId = () => { return { type: WIZARD_RESET_FLOW_ID } }