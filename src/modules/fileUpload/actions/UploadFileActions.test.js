describe("UploadFileActions", () => {

    describe("action type constants", () => {
        test("all constanst are unique in the file", () => { })
    })
    describe("displayFile", () => {

        test("displayFile dispatches action with type FILE_DISPLAY_FILE and the file as payload ", () => { })
        test("displayFile dispatches action with type FILE_DISPLAY_XML_CONTENT and the filecontent as payload when file.type = application/xml ", () => { })
        test("displayFile dispatches action with type FILE_DISPLAY_XML_CONTENT and the filecontent as payload when file.type = text/xml ", () => { })
        test("displayFile does not dispatches action with type FILE_DISPLAY_XML_CONTENT when file is null", () => { })
    })

    describe("uploadFile", () => {

        test("uploadFile dispatches action with type FILE_UPLOAD_CHANGE_FILE and the file as payload", () => { })
    })

    describe("setDownloadFile", () => {

        test("uploadFile dispatches action with type FILE_SET_DOWNLOAD_FILE and the file as payload", () => { })
    })
})