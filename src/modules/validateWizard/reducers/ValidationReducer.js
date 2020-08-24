import { VALIDATION_SET_INDICATION, VALIDATION_SET_SUBINDICATION } from "../actions/ValidationActions"
import { STORE_RESET } from "../../../store/storeActions"

const initialState = {
    indication: "",
    subIndication: ""
}

const ValidationReducer = (state = initialState, action) => {
    switch (action.type) {
        case VALIDATION_SET_INDICATION:
            return {
                ...state,
                indication: action.payload
            }
        case VALIDATION_SET_SUBINDICATION:
            return {
                ...state,
                subIndication: action.payload
            }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default ValidationReducer