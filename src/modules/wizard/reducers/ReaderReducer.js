

import { STORE_RESET } from "../actions/WizardLogicActions";

const initialState = {
    isChecked: false,
    isOk: false,
}


const ReaderReducer = (state = initialState, action) => {
    switch (action.type) {
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default ReaderReducer