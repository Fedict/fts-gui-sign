import { FILE_UPLOAD_CHANGE_FILE, FILE_SET_DOWNLOAD_FILE, FILE_DISPLAY_FILE } from "../actions/UploadFileActions"
import { STORE_RESET } from "../../../store/storeActions"

export const initialState = {
    file: {}, //uploaded file
    downloadFile: {
        bytes: "", //base64 representation of the signed file
        name: "" //name of the signed file
    },
    displayFile: { //file to display on the screen
        isPdf: false, //boolean to see if file is a pdf
        isXml: false, //boolean to see if file is a xml
        url: "", //object url to the file
        name: "", // name of the file
      
    }
}

/**
 * funtion that returns a object used in the store to display a file
 * @param {file} file - file that has to be represented
 */
export const getDisplayFileData = (file) => {
    if (file) {
        const type = file.type
        let data = {
            isPdf: false,
            isXml: false,
            name: file.name || "",
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

/**
 * function that removes the object URL
 * @param {string} url 
 */
export const removeURL = (url) => {
    URL.revokeObjectURL(url)
}

/**
 * reducer for the file handling
 */
const UploadFileReducer = (state = initialState, action) => {

    switch (action.type) {
        case FILE_UPLOAD_CHANGE_FILE: {
            return {
                ...state,
                "file": action.payload,
            }
        }
        case FILE_SET_DOWNLOAD_FILE: {
            if (state.displayFile.url) {
                removeURL(state.displayFile.url)
            }
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
        
        case STORE_RESET:
            if (state.displayFile.url) {
                removeURL(state.displayFile.url)
            }
            return initialState
        default:
            return state
    }
}

export default UploadFileReducer