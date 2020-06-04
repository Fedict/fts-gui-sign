describe(("UploadFileReducer"), () => {

    describe("getDisplayFileData", () => {
        test("getDisplayFileData creates correct object", () => { })
        test("getDisplayFileData creates correct object with filetype application/pdf", () => { })
        test("getDisplayFileData creates correct object with filetype application/xml", () => { })
        test("getDisplayFileData creates correct object with filetype text/xml", () => { })
        test("getDisplayFileData creates correct object with no file", () => { })
    })

    describe('removeURL', () => {
        test("removeURL calls URL.revokeObjectURL()", () => { })
    })

    describe("reducer", () => {
        describe("FILE_UPLOAD_CHANGE_FILE", () => {
            test("action with type FILE_UPLOAD_CHANGE_FILE changes file object", () => { })
        })

        describe("FILE_SET_DOWNLOAD_FILE", () => {
            test("action with type FILE_SET_DOWNLOAD_FILE changes downloadFile object", () => { })
            test("action with type FILE_SET_DOWNLOAD_FILE changes removes the displayed file", () => { })
        })

        describe("FILE_DISPLAY_FILE", () => {
            test('action with type FILE_DISPLAY_FILE changes displayFile object', () => { })
            test('action with type FILE_DISPLAY_FILE resets previous displayFile', () => { })
        })

        describe("FILE_DISPLAY_XML_CONTENT", () => {
            test('action with type FILE_DISPLAY_XML_CONTENT changes displayFile.xmlContent object', () => { })
        })

        describe("FILE_DISPLAY_XML_CONTENT", () => {
            test('action with type STORE_RESET resets back to initial state', () => { })
            test('action with type STORE_RESET resets previous displayFile', () => { })
        })
    })
})