const getXMLData = (document) => {
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
export const displayFile = (file) => async (dispatch) => {

    dispatch({ type: FILE_DISPLAY_FILE, payload: file })

    if (file.type === "application/xml" || file.type === "text/xml") {
        const content = await getXMLData(file)
        dispatch({type: FILE_DISPLAY_XML_CONTENT, payload : content})
    }

}


export const FILE_UPLOAD_CHANGE_FILE = "FILE_UPLOAD_CHANGE_FILE"
export const uploadFile = (file) => { return { type: FILE_UPLOAD_CHANGE_FILE, payload: file } }


export const FILE_SET_DOWNLOAD_FILE = "FILE_SET_DOWNLOAD_FILE"
export const setDownloadFile = (file) => { return { type: FILE_SET_DOWNLOAD_FILE, payload: file } }