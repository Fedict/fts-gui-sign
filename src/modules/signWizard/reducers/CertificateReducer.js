
import {
    CERTIFICATE_SAVE_LIST,
    CERTIFICATE_SELECT_CERTIFICATE
} from "../actions/CertificateActions"
import { STORE_RESET } from "../../../store/storeActions"


const initialState = {
    certificateList: [],
    certificateSelected: null,
}


const CertificateReducer = (state = initialState, action) => {
    switch (action.type) {
        case CERTIFICATE_SAVE_LIST:
            return { ...state, certificateList: action.payload }
        case CERTIFICATE_SELECT_CERTIFICATE:
            return { ...state, certificateSelected: action.payload }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default CertificateReducer