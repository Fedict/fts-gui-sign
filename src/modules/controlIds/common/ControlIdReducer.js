import { WIZARD_RESET_FLOW_ID } from "../flowId/FlowIdActions"
import { STORE_RESET } from "../../../store/storeActions"
import { generateId } from "./ControlIdHelper"
import { WIZARD_REQUEST_ID_ADD, WIZARD_REQUEST_ID_REMOVE } from "../requestId/RequestIdActions"


export const initialState = {
    flowId: generateId(""),
    requestIds: []
}

const ControlIdReducer = (state = initialState, action) => {
    switch (action.type) {
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
                flowId: generateId(state.flowId),
                requestIds: []
            }
        }
        default:
            return state
    }
}

export default ControlIdReducer

