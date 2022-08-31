import {STORE_RESET} from "../../../store/storeActions";
import {SET_DOCUMENT_TOKEN_METADATA, TOKEN_RECEIVED, SET_TOKEN_PREVIEW, SET_INPUTS_SIGN_STATE, SET_ALL_INPUTS} from "../actions/TokenActions";
import {defaults} from "../../utils/helper";
import { signState } from "../constants";

export const initialState = {

}

/**
 * reducer for the sign by token handling
 */
const TokenReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOKEN_RECEIVED:{
            return {
                ...state,
                token : action.payload.token,
                redirectUrl : action.payload.redirectUrl,
                clientNames : action.payload.clientNames,
                hookURL : action.payload.hookURL
                }
        }
        case SET_DOCUMENT_TOKEN_METADATA : {
            return {
                ...state,
                inputs : action.payload.inputs.map(input => { return { ...input, signState: signState.SIGN_REQUESTED } }),
                readPhoto : action.payload.readPhoto,
                previewDocuments : action.payload.previewDocuments,
                selectDocuments: action.payload.selectDocuments,
                noSignedDownloads : action.payload.noSignedDownloads,
                requestDocumentReadConfirm : action.payload.requestDocumentReadConfirm,
                signingType: action.payload.signingType
            }
        }
        case SET_TOKEN_PREVIEW : {
            return {
                ...state,
                previewDocuments : action.payload.previewDocuments,
            }
        }
        case SET_INPUTS_SIGN_STATE: {
            return {
                ...state,
                inputs: state.inputs.map(
                    (input, i) => i === action.payload.selector || action.payload.selector === SET_ALL_INPUTS || action.payload.selector === input.signState ? {...input, signState: action.payload.newState } : input
                )}
            }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default TokenReducer;