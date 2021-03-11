import {SIGNATURE_SET_DATE_SIGNING, SIGNATURE_SET_SIGNATURE} from "../actions/SignatureActions"
import { STORE_RESET } from "../../../store/storeActions"

export const initialState = {
    signature: "",
    signingDate : undefined
}

const SignatureReducer = (state = initialState, action) => {
    switch (action.type) {
        case SIGNATURE_SET_SIGNATURE:
            return {
                ...state,
                signature: action.payload,
            }
        case SIGNATURE_SET_DATE_SIGNING:
            return {
                ...state,
                signingDate : action.payload
            }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default SignatureReducer