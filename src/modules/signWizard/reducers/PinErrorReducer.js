
import { STORE_RESET } from "../actions/WizardLogicActions"
import { PIN_ERROR_SET_ERROR } from "../actions/SignErrorHandleActions"

const initialState = {
    message: ""
}

const PinErrorReducer = (state = initialState, action) => {
    switch (action.type) {
        case PIN_ERROR_SET_ERROR: {
            return {
                ...state,
                message: action.payload

            }
        }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default PinErrorReducer