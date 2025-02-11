import { WIZARD_STATE_START, WIZARD_STATE_RESULT } from "../../wizard/WizardConstants"
import { resetStore } from "../../../store/storeActions"
import { navigateToStep} from "../../wizard/WizardActions"
import { validateSignatureASyncAPI, getTaskResultAPI } from "../../communication/communication"
import { validationSet } from "./ValidationActions"
import { showErrorMessage } from "../../message/actions/MessageActions"
import { ErrorGeneral } from "../../message/MessageConstants"
import { setNewFlowId } from "../../controlIds/flowId/FlowIdActions"
import { handleFlowIdError } from "../../controlIds/flowId/FlowIdHelpers"

const INCORECT_FLOW_ID = "INCORECT_FLOW_ID"

export const resetWizard = () => (dispatch) => {
    dispatch(resetStore())
    dispatch(setNewFlowId())
    dispatch(navigateToStep(WIZARD_STATE_START))
}

const waitForValidatedDocument = (dispatch, uuid) => {
    setTimeout(() => {
        getTaskResultAPI(uuid).then((resp) => {
            if (!resp.error) {
                dispatch(validationSet(resp))
                dispatch(navigateToStep(WIZARD_STATE_RESULT))
            } else {
                if (resp === false) setTimeout(() => { waitForValidatedDocument(dispatch, uuid) }, 500);
                else dispatch(showErrorMessage(ErrorGeneral));
            }
        })
    }, 500);
}


export const validateDocument = () => (dispatch, getStore) => {
    const { uploadFile } = getStore()
    const flowId = getStore().controlId.flowId
    validateSignatureASyncAPI(uploadFile.file)
        .then(handleFlowIdError(flowId, getStore))
        .then((val) => {
            if (!val.error) waitForValidatedDocument(dispatch, val);
            else dispatch(showErrorMessage(ErrorGeneral));
        }).catch((err) => {
            if (err !== INCORECT_FLOW_ID) {
                dispatch(showErrorMessage(ErrorGeneral))
            }
        })
}