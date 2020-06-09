import { WIZARD_CHANGE_STATE, WIZARD_RESET_FLOW_ID, WIZARD_REQUEST_ID_ADD, WIZARD_REQUEST_ID_REMOVE } from "./WizardActions"
import { WIZARD_STATE_START } from "./WizardConstants"
import { STORE_RESET } from "../../store/storeActions"
import { getRequestId } from "./WizardHelper"

export const generateId = (oldId) => {

    return getRequestId([oldId])
}

export const initialState = {
    state: WIZARD_STATE_START,
    flowId: generateId(""),
    requestIds: []
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

        case WIZARD_REQUEST_ID_ADD: {
            return {
                ...state,
                requestIds: [...state.requestIds, action.payload]
            }
        }
        case WIZARD_REQUEST_ID_REMOVE: {
            return {
                ...state,
                requestIds: state.requestIds.filter(val => val !== action.payload)
            }
        }
        case STORE_RESET: {
            return {
                ...state,
                requestIds: []
            }
        }
        default:
            return state
    }
}

export default wizardReducer

