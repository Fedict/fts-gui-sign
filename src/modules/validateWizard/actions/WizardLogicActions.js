import { WIZARD_STATE_START, WIZARD_STATE_RESULT } from "../../wizard/WizardConstants"
import { resetStore } from "../../../store/storeActions"
import { navigateToStep, setNewFlowId } from "../../wizard/WizardActions"
import { validateSignature } from "../../communication/communication"
import { validationSetResult, validationSetIndication, validationSetSubIndication } from "./ValidationActions"
import { showErrorMessage } from "../../message/actions/MessageActions"
import { ErrorGeneral } from "../../message/MessageConstants"

export const resetWizard = () => (dispatch) => {
    dispatch(resetStore())
    dispatch(setNewFlowId())
    dispatch(navigateToStep(WIZARD_STATE_START))
}

const INCORECT_FLOW_ID = "INCORECT_FLOW_ID"
const handleFlowIdError = (flowId, getStore) => (resp) => {
    const flowIdcurrent = getStore().wizard.flowId
    if (flowIdcurrent === flowId) {
        return resp
    }
    else {
        throw INCORECT_FLOW_ID
    }
}

export const validateDocument = () => (dispatch, getStore) => {

    const { uploadFile } = getStore()
    const flowId = getStore().wizard.flowId
    validateSignature(uploadFile.file)
        .then(handleFlowIdError(flowId, getStore))
        .then((val) => {
            dispatch(validationSetIndication(val.indication))
            dispatch(validationSetSubIndication(val.subIndication))
            dispatch(navigateToStep(WIZARD_STATE_RESULT))
        })
        .catch((err) => {
            if (err !== INCORECT_FLOW_ID) {
                console.log("err", err)
                dispatch(showErrorMessage(ErrorGeneral))
            }
        })



}