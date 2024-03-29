import {
    CERTIFICATE_SAVE_LIST,
    CERTIFICATE_SELECT_CERTIFICATE
} from "../actions/CertificateActions"
import { STORE_RESET } from "../../../store/storeActions"

export const initialState = {
    certificateList: [],
    certificateSelected: null,
    neverSaved: true
}

const CertificateReducer = (state = initialState, action) => {
    switch (action.type) {
        case CERTIFICATE_SAVE_LIST:
            return { ...state, certificateList: action.payload, neverSaved: false  }
        case CERTIFICATE_SELECT_CERTIFICATE:
            return { ...state, certificateSelected: action.payload }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export const getIsPinPadReader = (state) => {
    return (state
        && state.certificateSelected
        && state.certificateSelected.readerType
        && state.certificateSelected.readerType === "pinpad")
}

export default CertificateReducer