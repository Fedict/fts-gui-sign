import {SET_PREVIEW_FILE_ID} from "../actions/TokenActions";

export const initialState = {
    index: 0
}

/**
 * reducer for the sign by token handling
 */
const FilePreviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PREVIEW_FILE_ID:{
            return {
                ...state,
                index : action.payload.index,
            }
        }
        default:
            return state
    }
}

export default FilePreviewReducer;