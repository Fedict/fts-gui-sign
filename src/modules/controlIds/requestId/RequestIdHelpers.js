import { removeRequestId } from "./RequestIdActions"


export const INCORECT_REQUEST_ID = "INCORECT_REQUEST_ID"

export const getRequestIds = (getStore) => {
    const { controlId } = getStore()
    return controlId.requestIds
}

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





