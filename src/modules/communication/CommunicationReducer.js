import { WIZARD_CHANGE_STATE } from "./WizardActions"
import {  WIZARD_STATE_START } from "./WizardConstants"

const initialState = {
    state: WIZARD_STATE_START,
   
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