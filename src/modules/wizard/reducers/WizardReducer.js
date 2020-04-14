import { WIZARD_CHANGE_STATE } from "../actions/WizardActions"
import { WIZARD_STATE_UPLOAD } from "../wizard/WizardConstants"




const initialState = {
    state: WIZARD_STATE_UPLOAD
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