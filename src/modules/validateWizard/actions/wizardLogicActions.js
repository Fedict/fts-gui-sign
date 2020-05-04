import { WIZARD_STATE_START, WIZARD_STATE_RESULT } from "../../wizard/WizardConstants"
import { resetStore } from "../../../store/storeActions"
import { navigateToStep } from "../../wizard/WizardActions"
import { validateSignature } from "../../communication/communication"
import { validationSetResult, validationSetIndication, validationSetSubIndication } from "./ValidationActions"
import { showErrorMessage } from "../../message/actions/MessageActions"
import { ErrorGeneral } from "../../message/MessageConstants"

export const resetWizard = () => (dispatch) => {
    dispatch(resetStore())
    dispatch(navigateToStep(WIZARD_STATE_START))
}

export const validateDocument = () => (dispatch, getStore) => {

    const { uploadFile } = getStore()

    validateSignature(uploadFile.file)

        .then((val) => {
            dispatch(validationSetIndication(val.indication))
            dispatch(validationSetSubIndication(val.subIndication))
            dispatch(navigateToStep(WIZARD_STATE_RESULT))
        })
        .catch((err) => {
            console.log("err", err)
            dispatch(showErrorMessage(ErrorGeneral))
        })



}