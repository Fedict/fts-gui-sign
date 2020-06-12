export const INCORECT_FLOW_ID = "INCORECT_FLOW_ID"

export const handleFlowIdError = (flowId, getStore) => (resp) => {
    const flowIdcurrent = getStore().controlId.flowId
    if (flowIdcurrent === flowId) {
        return resp
    }
    else {
        throw INCORECT_FLOW_ID
    }
}