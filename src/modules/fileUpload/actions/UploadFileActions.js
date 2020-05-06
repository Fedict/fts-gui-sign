export const FILE_DISPLAY_FILE = "FILE_DISPLAY_FILE"
export const displayFile = (file) => { return { type: FILE_DISPLAY_FILE, payload: file } }



export const FILE_UPLOAD_CHANGE_FILE = "FILE_UPLOAD_CHANGE_FILE"
export const uploadFile = (file) => { return { type: FILE_UPLOAD_CHANGE_FILE, payload: file } }


export const FILE_SET_DOWNLOAD_FILE = "FILE_SET_DOWNLOAD_FILE"
export const setDownloadFile = (file) => { return { type: FILE_SET_DOWNLOAD_FILE, payload: file } }