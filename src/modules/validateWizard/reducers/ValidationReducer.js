import { VALIDATION_SET } from "../actions/ValidationActions"
import { STORE_RESET } from "../../../store/storeActions"

const initialState = {
    report: "",
    normalizedReport: ""
}

const ValidationReducer = (state = initialState, action) => {
    switch (action.type) {
        case VALIDATION_SET:
            return {
                ...state,
                report: action.payload.report,
                normalizedReport: action.payload.normalizedReport
            }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default ValidationReducer