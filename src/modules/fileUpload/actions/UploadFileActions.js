/**
 * function that returns a promise that resolves in the content of the file.
 * @param {file} document 
 */
const getContentData = (document) => {
    return new Promise((resolve, rejects) => {
        let reader = new FileReader();
        reader.onload = (event) => {

            resolve(event.target.result);
        }
        reader.onerror = (err) => {
            rejects(err);
        }

        reader.readAsText(document);
    })
}

export const FILE_DISPLAY_FILE = "FILE_DISPLAY_FILE"
export const FILE_DISPLAY_XML_CONTENT = "FILE_DISPLAY_XML_CONTENT"

/**
 * Action to display the content of a file
 * @param {file} file - file object of the file that has to be displayed
 */
export const displayFile = (file) => async (dispatch) => {

    dispatch({ type: FILE_DISPLAY_FILE, payload: file })

    if (file.type === "application/xml" || file.type === "text/xml") {
        const content = await getContentData(file)
        dispatch({type: FILE_DISPLAY_XML_CONTENT, payload : content})
    }

}


export const FILE_UPLOAD_CHANGE_FILE = "FILE_UPLOAD_CHANGE_FILE"
/**
 * action to save a file in the store
 * @param {file} file - file that needs to be saves/signed
 */
export const uploadFile = (file) => { return { type: FILE_UPLOAD_CHANGE_FILE, payload: file } }


export const FILE_SET_DOWNLOAD_FILE = "FILE_SET_DOWNLOAD_FILE"
/**
 * action to save the download file.
 * @param {string} file - base64 encoded file
 */
export const setDownloadFile = (file) => { return { type: FILE_SET_DOWNLOAD_FILE, payload: file } }