import { FILE_UPLOAD_CHANGE_FILE, FILE_SET_DOWNLOAD_FILE, FILE_DISPLAY_FILE, FILE_DISPLAY_XML_CONTENT } from "../actions/UploadFileActions"
import { STORE_RESET } from "../../../store/storeActions"

const initialState = {
    file: {},
    downloadFile: {
        bytes: "",
        name: ""
    },
    displayFile: {
        isPdf: false,
        isXml: false,
        url: "",
        name: ""
    }
}

const getDisplayFileData = (file) => {
    if (file) {
        const type = file.type
        let data = {
            isPdf: false,
            isXml: false,
            name: file.name,
            url: ""
        }
        switch (type) {
            case "application/pdf":
                data.isPdf = true
                data.url = URL.createObjectURL(file)
                break;
            case "application/xml":
            case "text/xml":
                data.isXml = true
                
                break;

            default:
                break
        }

        return (data)
    }
    return {
        isPdf: false,
        isXml: false,
        name: "",
        url: ""
    }
}


const removeURL = (url) => {
    URL.revokeObjectURL(url)
}


/**
 * reducer for the fileHandeling
 */
const UploadFileReducer = (state = initialState, action) => {

    switch (action.type) {
        case FILE_UPLOAD_CHANGE_FILE: {
            if (state.displayFile.url) {
                removeURL(state.displayFile.url)
            }
            return {
                ...state,
                "file": action.payload,
                displayFile: initialState.displayFile

            }
        }
        case FILE_SET_DOWNLOAD_FILE: {
            return {
                ...state,
                downloadFile: action.payload,
                displayFile: initialState.displayFile
            }
        }
        case FILE_DISPLAY_FILE: {
            if (state.displayFile.url) {
                removeURL(state.displayFile.url)
            }
            return {
                ...state,
                displayFile: getDisplayFileData(action.payload)
            }
        }
        case FILE_DISPLAY_XML_CONTENT:
            return {
                ...state,
                displayFile: {
                    ...state.displayFile,
                    xmlContent : action.payload
                }
            }
        case STORE_RESET:
            return initialState
        default:
            return state
    }
}

export default UploadFileReducer

