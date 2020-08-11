export const INCORECT_FLOW_ID = "INCORECT_FLOW_ID"

/**
 * function that checks if the flowId is correct
 * @param {number} flowId - flowId
 * @param {funtion} getStore - function to get the store
 */
export const handleFlowIdError = (flowId, getStore) => (resp) => {
    const flowIdcurrent = getStore().controlId.flowId
    if (flowIdcurrent === flowId) {
        return resp
    }
    else {
        throw INCORECT_FLOW_ID
    }
}