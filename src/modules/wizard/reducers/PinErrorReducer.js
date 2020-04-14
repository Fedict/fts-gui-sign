import { PIN_ERROR_SET_ERROR } from "../actions/PinErrorActions"

const initialState = {
    message: {}
}

const UploadFileReducer = (state = initialState, action) => {
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

export default UploadFileReducer