import { WIZARD_STATE_START, WIZARD_STATE_RESULT } from "../../wizard/WizardConstants"
import { resetStore } from "../../../store/storeActions"
import { navigateToStep } from "../../wizard/WizardActions"
import { validateSignature } from "../../communication/communication"

export const resetWizard = () => (dispatch) => {
    dispatch(resetStore())
    dispatch(navigateToStep(WIZARD_STATE_START))
}

export const validateDocument = () => (dispatch, getStore) => {

    const { uploadFile } = getStore()

    validateSignature(uploadFile.file).then((val) => {
        console.log(val);
        dispatch(navigateToStep(WIZARD_STATE_RESULT))
    })


}