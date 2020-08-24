import { WIZARD_STATE_START, WIZARD_STATE_RESULT } from "../../wizard/WizardConstants"
import { resetStore } from "../../../store/storeActions"
import { navigateToStep} from "../../wizard/WizardActions"
import { validateSignatureAPI } from "../../communication/communication"
import { validationSetIndication, validationSetSubIndication } from "./ValidationActions"
import { showErrorMessage } from "../../message/actions/MessageActions"
import { ErrorGeneral } from "../../message/MessageConstants"
import { setNewFlowId } from "../../controlIds/flowId/FlowIdActions"
import { handleFlowIdError } from "../../controlIds/flowId/FlowIdHelpers"

const INCORECT_FLOW_ID = "INCORECT_FLOW_ID"

const INCORECT_FLOW_ID = "INCORECT_FLOW_ID"

export const resetWizard = () => (dispatch) => {
    dispatch(resetStore())
    dispatch(setNewFlowId())
    dispatch(navigateToStep(WIZARD_STATE_START))
}

export const validateDocument = () => (dispatch, getStore) => {
    const { uploadFile } = getStore()
    const flowId = getStore().controlId.flowId
    validateSignatureAPI(uploadFile.file)
        .then(handleFlowIdError(flowId, getStore))
        .then((val) => {
            dispatch(validationSetIndication(val.indication))
            dispatch(validationSetSubIndication(val.subIndication))
            dispatch(navigateToStep(WIZARD_STATE_RESULT))
        })
        .catch((err) => {
            if (err !== INCORECT_FLOW_ID) {
                dispatch(showErrorMessage(ErrorGeneral))
            }
        })
}