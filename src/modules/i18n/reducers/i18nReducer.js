import {
    LANGUAGE_CHOSEN
} from "../actions/i18nActions"
import { STORE_RESET } from "../../../store/storeActions"
import {languages} from "../../../const";


export const initialState = {
    language : languages[0]
}

const i18nReducer = (state = initialState, action) => {
    switch (action.type) {
        case LANGUAGE_CHOSEN:
            return { language: action.payload }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default i18nReducer