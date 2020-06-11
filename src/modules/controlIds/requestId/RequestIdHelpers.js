import { generateIdFromArray } from "../common/ControlIdHelper"
import { addRequestId, removeRequestId } from "./RequestIdActions"
import { controller } from "../../eIdLink/controller"


export const getRequestIds = (getStore) => {
    const { controlId } = getStore()
    return controlId.requestIds
}

export const INCORECT_REQUEST_ID = "INCORECT_REQUEST_ID"
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





