import {STORE_RESET} from "../../../store/storeActions";
import { INVISIBLE_SIGNATURE } from "../../fileUpload/reducers/CustomSignatureReducer";
import {SET_DOCUMENT_TOKEN_METADATA, TOKEN_RECEIVED, SET_TOKEN_PREVIEW, SET_INPUTS_SIGN_STATE, SET_ALL_INPUTS, SET_CUSTOM_SIGNATURE} from "../actions/TokenActions";
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
                inputs : action.payload.inputs.map(input => { return { ...input, signState: signState.SIGN_REQUESTED, customSignature: {
                        signatureArea: null,
                        signatureSelected: INVISIBLE_SIGNATURE,
                        photoIncluded: false,
                    } }}),
                previewDocuments : action.payload.previewDocuments,
                selectDocuments: action.payload.selectDocuments,
                noSignedDownloads : action.payload.noSignedDownloads,
                requestDocumentReadConfirm : action.payload.requestDocumentReadConfirm,
                noSkipErrors: action.payload.noSkipErrors,
                signAll: action.payload.signAll
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
                    (input, i) => i === action.payload.selector || action.payload.selector === SET_ALL_INPUTS || action.payload.selector === input.signState ? {...input, signState: action.payload.newState } : { ...input }
                )}
            }
        case SET_CUSTOM_SIGNATURE:
            return {
                ...state,
                inputs: state.inputs.map(
                    (input, i) => i === action.payload.fileId ? {...input, customSignature: action.payload.customSignature } : { ...input }
                )
            }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default TokenReducer;