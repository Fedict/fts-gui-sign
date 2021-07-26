import {PIN_ERROR_SET_ERROR, STORE_RESET_PIN_ERROR} from "../actions/SignErrorHandleActions"
import { STORE_RESET } from "../../../store/storeActions"

export const initialState = {
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
        case STORE_RESET_PIN_ERROR: {
            return initialState
        }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default PinErrorReducer