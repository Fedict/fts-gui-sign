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

    const requestIds = getRequestIds(getStore)

    const requestId = generateIdFromArray(requestIds)
    dispatch(addRequestId(requestId))

    setTimeout(() => {
        const { controlId } = getStore()
        const requestIds = [...controlId.requestIds]
        dispatch(removeRequestId(requestId))
        if (requestIds.includes(requestId)) {
            dispatch(timeoutCallbackAction)
        }
        else {
            //nothing wrong
        }
    }, timeout)
    return requestId
}


