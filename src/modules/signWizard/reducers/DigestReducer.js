
import { DIGEST_SET_DIGEST } from "../actions/DigestActions"
import { STORE_RESET } from "../../../store/storeActions"

export const initialState = {
    digest: "",
    digestAlgorithm: ""
}

const DigestReducer = (state = initialState, action) => {
    switch (action.type) {
        case DIGEST_SET_DIGEST:
            return {
                ...state,
                digest: action.payload.digest,
                digestAlgorithm: action.payload.digestAlgorithm
            }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default DigestReducer