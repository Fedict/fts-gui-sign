import { getRequestIds } from "./RequestIdHelpers"
import { generateIdFromArray } from "../common/ControlIdHelper"

export const WIZARD_REQUEST_ID_ADD = "WIZARD_REQUEST_ID_ADD"
export const addRequestId = (id) => {
    return ({ type: WIZARD_REQUEST_ID_ADD, payload: id })

}

export const WIZARD_REQUEST_ID_REMOVE = "WIZARD_REQUEST_ID_REMOVE"
export const removeRequestId = (id) => {
    return ({ type: WIZARD_REQUEST_ID_REMOVE, payload: id })
}

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


