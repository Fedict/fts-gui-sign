import {STORE_RESET} from "../../../store/storeActions";
import UploadFileReducer from "../../fileUpload/reducers/UploadFileReducer";
import {TOKEN_RECEIVED} from "../actions/TokenActions";

export const initialState = {

}

/**
 * reducer for the sign by token handling
 */
const TokenReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOKEN_RECEIVED:{
            return {...state, token : action.payload.token, redirectUrl : action.payload.redirectUrl}
        }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default TokenReducer;