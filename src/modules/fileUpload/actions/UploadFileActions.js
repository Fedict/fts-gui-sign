export const FILE_DISPLAY_FILE = "FILE_DISPLAY_FILE"
export const FILE_UPLOAD_CHANGE_FILE = "FILE_UPLOAD_CHANGE_FILE"
export const FILE_SET_DOWNLOAD_FILE = "FILE_SET_DOWNLOAD_FILE"

/**
 * Action to display the content of a file
 * @param {file} file - file object of the file that has to be displayed
 */
export const displayFile = (file) => async (dispatch) => {
    dispatch({ type: FILE_DISPLAY_FILE, payload: file })
}


/**
 * action to save a file in the store
 * @param {file} file - file that needs to be saves/signed
 */
export const uploadFile = (file) => { return { type: FILE_UPLOAD_CHANGE_FILE, payload: file } }


/**
 * action to save the download file.
 * @param {string} file - base64 encoded file
 */
export const setDownloadFile = (file) => { return { type: FILE_SET_DOWNLOAD_FILE, payload: file } }