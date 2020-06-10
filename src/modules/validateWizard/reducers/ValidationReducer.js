import { VALIDATION_SET_INDICATION, VALIDATION_SET_SUBINDICATION } from "../actions/ValidationActions"

//TODO reset Store

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
        default:
            return state
    }
}

export default ValidationReducer