
import { STORE_RESET } from "../actions/WizardLogicActions"
import { SIGNATURE_SET_SIGNATURE } from "../actions/SignatureActions"

const initialState = {

}


const SignatureReducer = (state = initialState, action) => {
    switch (action.type) {
        case SIGNATURE_SET_SIGNATURE:
            return {
                ...state,
                signature: action.payload,
            }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default SignatureReducer