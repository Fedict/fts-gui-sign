import { FILE_UPLOAD_CHANGE_FILE, FILE_SET_DOWNLOAD_FILE } from "../actions/UploadFileActions"
import { STORE_RESET } from "../../signWizard/actions/WizardLogicActions"

const initialState = {
    file: {},
    downloadFile: {
        bytes: "",
        name: ""
    }
}

const UploadFileReducer = (state = initialState, action) => {

    switch (action.type) {
        case FILE_UPLOAD_CHANGE_FILE: {

            return {
                ...state,
                "file": action.payload

            }
        }
        case FILE_SET_DOWNLOAD_FILE: {
            return {
                ...state,
                downloadFile: action.payload
            }
        }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default UploadFileReducer