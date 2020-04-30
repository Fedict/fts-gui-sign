import { WIZARD_STATE_START } from "../../wizard/WizardConstants"
import { resetStore } from "../../../store/storeActions"
import { navigateToStep } from "../../wizard/WizardActions"

export const resetWizard = () => (dispatch) => {
    dispatch(resetStore())
    dispatch(navigateToStep(WIZARD_STATE_START))
}