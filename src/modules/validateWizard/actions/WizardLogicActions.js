import { WIZARD_STATE_START, WIZARD_STATE_RESULT } from "../../wizard/WizardConstants"
import { resetStore } from "../../../store/storeActions"
import { navigateToStep} from "../../wizard/WizardActions"
import { validateSignatureASyncAPI, waitForASyncTask } from "../../communication/communication"
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

export const validateDocument = () => (dispatch, getStore) => {
    const { uploadFile } = getStore()
    const flowId = getStore().controlId.flowId
    validateSignatureASyncAPI(uploadFile.file)
        .then(handleFlowIdError(flowId, getStore))
        .then((val) => {
            waitForASyncTask(val, (resp) => {
                const ok = resp.indication && resp.normalizedReport;
                if (ok) {
                    dispatch(validationSet(resp))
                    dispatch(navigateToStep(WIZARD_STATE_RESULT))
                }
                return ok;
            },
            (resp) => {
                dispatch(showErrorMessage(ErrorGeneral));
            },
            (err) => {
                if (err !== INCORECT_FLOW_ID) dispatch(showErrorMessage(ErrorGeneral))
            })
        }).catch((err) => {
            if (err !== INCORECT_FLOW_ID) {
                dispatch(showErrorMessage(ErrorGeneral))
            }
        })
}