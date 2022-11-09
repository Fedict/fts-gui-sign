import { VALIDATION_SET_DIAGNOSTICDATA, VALIDATION_SET_REPORT } from "../actions/ValidationActions"
import { STORE_RESET } from "../../../store/storeActions"

const initialState = {
    report: "",
    diagnosticData: ""
}

const ValidationReducer = (state = initialState, action) => {
    switch (action.type) {
        case VALIDATION_SET_REPORT:
            return {
                ...state,
                report: action.payload
            }
        case VALIDATION_SET_DIAGNOSTICDATA:
            return {
                ...state,
                diagnosticData: action.payload
            }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default ValidationReducer