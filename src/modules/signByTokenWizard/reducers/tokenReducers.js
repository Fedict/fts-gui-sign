import {STORE_RESET} from "../../../store/storeActions";
import {SET_DOCUMENT_TOKEN_METADATA, TOKEN_RECEIVED} from "../actions/TokenActions";
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
                isPdf : action.payload.isPdf,
                isXml : action.payload.isXml,
                fileName : action.payload.fileName,
                xsltUrl : defaults(action.payload.xsltUrl, state.xsltUrl),
                readPhoto : action.payload.readPhoto,
                disallowSignedDownloads : action.payload.disallowSignedDownloads,
                requestDocumentReadConfirm : action.payload.requestDocumentReadConfirm
            }
        }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default TokenReducer;