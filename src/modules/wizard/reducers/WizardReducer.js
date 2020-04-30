import { WIZARD_CHANGE_STATE } from "../actions/WizardActions"
import { WIZARD_STATE_UPLOAD, WIZARD_STATE_VERSION_CHECK_LOADING } from "../wizard/WizardConstants"




const initialState = {
    state: WIZARD_STATE_VERSION_CHECK_LOADING
}

const wizardReducer = (state = initialState, action) => {
    switch (action.type) {
        case WIZARD_CHANGE_STATE: {
            return {
                ...state,
                "state": action.payload

            }
        }
        default:
            return state
    }
}

export default wizardReducer