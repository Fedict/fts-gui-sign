import { getRequestIds } from "./RequestIdHelpers"
import { generateIdFromArray } from "../common/ControlIdHelper"

export const WIZARD_REQUEST_ID_ADD = "WIZARD_REQUEST_ID_ADD"
export const WIZARD_REQUEST_ID_REMOVE = "WIZARD_REQUEST_ID_REMOVE"

/**
 * action to add a requestId to the store
 * @param {number} id - requestId 
 */
export const addRequestId = (id) => {
    return ({ type: WIZARD_REQUEST_ID_ADD, payload: id })

}

/**
 * action to remove a requestId from the store
 * @param {number} id - requestId 
 */
export const removeRequestId = (id) => {
    return ({ type: WIZARD_REQUEST_ID_REMOVE, payload: id })
}

/**
 * action to create a new requestId and create a timeout function
 * @param {number} timeout - timeout time in ms
 * @param {function} timeoutCallbackAction - callback action that is called after the timeout and the requestId still exists 
 */
export const createRequestId = (timeout, timeoutCallbackAction) => (dispatch, getStore) => {

    const requestId = generateIdFromArray(getRequestIds(getStore))
    dispatch(addRequestId(requestId))

    setTimeout(() => {
        const requestIds = getRequestIds(getStore)
        dispatch(removeRequestId(requestId))
        if (requestIds.includes(requestId)) {
            dispatch(timeoutCallbackAction)
        }
    }, timeout)
    
    return requestId
}