
export const WIZARD_CHANGE_STATE = "WIZARD_CHANGE_STATE"
export const navigateToStep = (route) => {
    return { type: WIZARD_CHANGE_STATE, payload: route }
}

export const WIZARD_RESET_FLOW_ID = "WIZARD_RESET_FLOW_ID"
export const setNewFlowId = () => { return { type: WIZARD_RESET_FLOW_ID } }





export const WIZARD_REQUEST_ID_ADD = "WIZARD_REQUEST_ID_ADD"
export const addRequestId = (id) => {
    return ({ type: WIZARD_REQUEST_ID_ADD, payload: id })

}

export const WIZARD_REQUEST_ID_REMOVE = "WIZARD_REQUEST_ID_REMOVE"
export const removeRequestId = (id) => {
    return ({ type: WIZARD_REQUEST_ID_REMOVE, payload: id })
}