import { removeRequestId } from "./RequestIdActions"

export const INCORECT_REQUEST_ID = "INCORECT_REQUEST_ID"

/**
 * function to get a list of requestIds
 * @param {function} getStore - function to get the store
 */
export const getRequestIds = (getStore) => {
    const { controlId } = getStore()
    return controlId.requestIds
}

/**
 * function to check if the requestId is correct
 * will remove the requestId
 * @param {number} id - old Id 
 * @param {function} dispatch - function to dispatch a action
 * @param {function} getStore - function to get the store
 */
export const handleRequestIdError = (id, dispatch, getStore) => (resp) => {
    const requestIds = getRequestIds(getStore)
    dispatch(removeRequestId(id))
    if (requestIds.includes(id)) {
        return resp
    }
    else {
        throw INCORECT_REQUEST_ID
    }
}