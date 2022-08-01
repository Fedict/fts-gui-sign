import {STORE_RESET} from "../../../store/storeActions";
import {SET_DOCUMENT_TOKEN_METADATA, TOKEN_RECEIVED, SET_TOKEN_PREVIEW, SET_INPUT_SELECTION} from "../actions/TokenActions";
import {defaults} from "../../utils/helper";

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
                xsltUrl : action.payload.xsltUrl
            }
        }
        case SET_DOCUMENT_TOKEN_METADATA : {
            return {
                ...state,
                inputs : action.payload.inputs,
                readPhoto : action.payload.readPhoto,
                previewDocuments : action.payload.previewDocuments,
                disallowSignedDownloads : action.payload.disallowSignedDownloads,
                requestDocumentReadConfirm : action.payload.requestDocumentReadConfirm
            }
        }
        case SET_TOKEN_PREVIEW : {
            return {
                ...state,
                previewDocuments : action.payload.previewDocuments,
            }
        }
        case SET_INPUT_SELECTION: {
            return {
                ...state,
                inputs: state.inputs.map(
                    (input, i) => i === action.payload.index ? {...input, isSelected: action.payload.value} : { ...input }
                )}
            }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default TokenReducer;