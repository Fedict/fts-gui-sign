import { WIZARD_CHANGE_STATE, WIZARD_RESET_FLOW_ID } from "./WizardActions"
import { WIZARD_STATE_START } from "./WizardConstants"

const generateId = (oldId) => {

    let newId = ""
    do {
        newId = Math.floor(Math.random() * Math.floor(99999))
    }
    while (oldId === newId)

    return newId
}

const initialState = {
    state: WIZARD_STATE_START,
    flowId: generateId("")
}

const wizardReducer = (state = initialState, action) => {
    switch (action.type) {
        case WIZARD_CHANGE_STATE: {
            return {
                ...state,
                "state": action.payload,

            }
        }
        case WIZARD_RESET_FLOW_ID: {
            return {
                ...state,
                flowId: generateId(state.flowId)
            }
        }
        default:
            return state
    }
}

export default wizardReducer

