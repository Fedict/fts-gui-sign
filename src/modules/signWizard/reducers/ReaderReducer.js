
import { READER_SET_CHECK, READER_SET_OK } from "../actions/ReaderActions";
import { STORE_RESET } from "../../../store/storeActions";

const initialState = {
    isChecked: false,
    isOk: false,
}


const ReaderReducer = (state = initialState, action) => {
    switch (action.type) {
        case READER_SET_CHECK:
            return { ...state, isChecked: action.payload }
        case READER_SET_OK:
            return { ...state, isOk: action.payload }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default ReaderReducer