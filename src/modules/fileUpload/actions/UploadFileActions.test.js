import { FILE_DISPLAY_FILE, FILE_UPLOAD_CHANGE_FILE, FILE_SET_DOWNLOAD_FILE, displayFile, uploadFile, setDownloadFile } from "./UploadFileActions"
import * as fileHelper from '../helpers/FileHelper'
import { getContentData } from '../helpers/FileHelper'

const ORIGINAL_getContentData = getContentData;
const RESOLVE_FILECONTENT = "file_content"
describe("UploadFileActions", () => {

    describe("action type constants", () => {
        test("all constants are unique in the file", () => {
            const listOfConst = [
                FILE_DISPLAY_FILE,
                FILE_UPLOAD_CHANGE_FILE,
                FILE_SET_DOWNLOAD_FILE,
            ]

            const setOfConst = new Set(listOfConst)

            expect(listOfConst.length).toEqual(setOfConst.size)
        })
    })
    describe("displayFile", () => {

        beforeEach(() => {
            fileHelper.getContentData = jest.fn(() => { return Promise.resolve(RESOLVE_FILECONTENT) })
        })

        test("displayFile dispatches action with type FILE_DISPLAY_FILE and the file as payload ", async () => {
            const startFile = { type: "test", }
            const mockDispatch = jest.fn()

            await displayFile(startFile)(mockDispatch)

            expect(mockDispatch).toBeCalledTimes(1)
            expect(mockDispatch.mock.calls[0][0].type).toBe(FILE_DISPLAY_FILE)
            expect(mockDispatch.mock.calls[0][0].payload).toEqual(startFile)
        })
       
      
       

        afterEach(() => {
            fileHelper.getContentData = ORIGINAL_getContentData
        })

    })

    describe("uploadFile", () => {

        test("uploadFile dispatches action with type FILE_UPLOAD_CHANGE_FILE and the file as payload", () => {
            const startFile = { att: "atts" }
            const result = uploadFile(startFile)

            expect(result.payload).toBe(startFile)
            expect(result.type).toBe(FILE_UPLOAD_CHANGE_FILE)
        })
    })

    describe("setDownloadFile", () => {

        test("uploadFile dispatches action with type FILE_SET_DOWNLOAD_FILE and the file as payload", () => {
            const startFile = { att: "atts" }
            const result = setDownloadFile(startFile)

            expect(result.payload).toBe(startFile)
            expect(result.type).toBe(FILE_SET_DOWNLOAD_FILE)
        })
    })
})