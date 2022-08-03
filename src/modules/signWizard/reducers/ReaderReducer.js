import { READER_SET_CHECK, READER_SET_OK, READER_SET_BEIDCONNECT_VERSION } from "../actions/ReaderActions";
import { STORE_RESET } from "../../../store/storeActions";

export const initialState = {
    isChecked: false,
    isOk: false,
    beidConnectVersion: undefined,
}

const ReaderReducer = (state = initialState, action) => {
    switch (action.type) {
        case READER_SET_CHECK:
            return { ...state, isChecked: action.payload }
        case READER_SET_OK:
            return { ...state, isOk: action.payload }
        case STORE_RESET:
            return initialState
        case READER_SET_BEIDCONNECT_VERSION:
            return { ...state, beidConnectVersion: action.payload }
        default:
            return state
    }
}

export default ReaderReducer