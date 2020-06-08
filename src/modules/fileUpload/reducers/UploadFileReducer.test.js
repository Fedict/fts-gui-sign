import UploadFileReducer, { getDisplayFileData, removeURL, initialState } from "./UploadFileReducer";
import { FILE_UPLOAD_CHANGE_FILE, FILE_SET_DOWNLOAD_FILE, FILE_DISPLAY_FILE, FILE_DISPLAY_XML_CONTENT } from "../actions/UploadFileActions";
import { STORE_RESET } from "../../../store/storeActions";
let ORIGINAL_URL = { ...URL }
describe(("UploadFileReducer"), () => {

    describe("getDisplayFileData", () => {

        beforeEach(() => {
            URL.createObjectURL = jest.fn()
        })

        test("getDisplayFileData creates correct object with unknown filetype", () => {
            const startFileName = "test.txt"
            const startFileType = "test"
            const startFile = { type: startFileType, name: startFileName }
            const result = getDisplayFileData(startFile)
            expect(result.isPdf).toBeFalsy()
            expect(result.isXml).toBeFalsy()
            expect(result.url).toEqual("")
            expect(result.name).toBe(startFileName)
        })
        test("getDisplayFileData creates correct object with filetype application/pdf", () => {
            const startFileName = "test.txt"
            const startFileType = "application/pdf"
            const startFile = { type: startFileType, name: startFileName }
            const expectedUrl = "url"
            URL.createObjectURL = jest.fn(() => { return expectedUrl })
            const result = getDisplayFileData(startFile)
            expect(result.isPdf).toBeTruthy()
            expect(result.isXml).toBeFalsy()
            expect(result.url).toEqual(expectedUrl)
            expect(result.name).toBe(startFileName)

            expect(URL.createObjectURL).toHaveBeenCalledTimes(1)
            expect(URL.createObjectURL.mock.calls[0][0]).toEqual(startFile)
        })
        test("getDisplayFileData creates correct object with filetype application/xml", () => {
            const startFileName = "test.txt"
            const startFileType = "application/xml"
            const startFile = { type: startFileType, name: startFileName }
            const result = getDisplayFileData(startFile)
            expect(result.isPdf).toBeFalsy()
            expect(result.isXml).toBeTruthy()
            expect(result.url).toEqual("")
            expect(result.name).toBe(startFileName)

            expect(URL.createObjectURL).toHaveBeenCalledTimes(0)
        })
        test("getDisplayFileData creates correct object with filetype text/xml", () => {
            const startFileName = "test.txt"
            const startFileType = "text/xml"
            const startFile = { type: startFileType, name: startFileName }
            const result = getDisplayFileData(startFile)
            expect(result.isPdf).toBeFalsy()
            expect(result.isXml).toBeTruthy()
            expect(result.url).toEqual("")
            expect(result.name).toBe(startFileName)

            expect(URL.createObjectURL).toHaveBeenCalledTimes(0)
        })
        test("getDisplayFileData creates correct object with no file", () => {
            const startFile = undefined
            const result = getDisplayFileData(startFile)
            expect(result.isPdf).toBeFalsy()
            expect(result.isXml).toBeFalsy()
            expect(result.url).toEqual("")
            expect(result.name).toBe("")
        })

        test("getDisplayFileData creates correct object with empty file object", () => {
            const startFile = {}
            const result = getDisplayFileData(startFile)
            expect(result.isPdf).toBeFalsy()
            expect(result.isXml).toBeFalsy()
            expect(result.url).toEqual("")
            expect(result.name).toBe("")
        })

        afterEach(() => {
            URL.createObjectURL = ORIGINAL_URL.createObjectURL
        })
    })

    describe('removeURL', () => {
        beforeAll(() => {
            URL.revokeObjectURL = jest.fn()
        })
        test("removeURL calls URL.revokeObjectURL()", () => {
            const startUrl = "url"
            removeURL(startUrl)
            expect(URL.revokeObjectURL).toBeCalledTimes(1)
            expect(URL.revokeObjectURL).toBeCalledWith(startUrl)
        })
        afterAll(() => {
            URL.revokeObjectURL = ORIGINAL_URL.revokeObjectURL
        })
    })

    describe("reducer", () => {
        describe("FILE_UPLOAD_CHANGE_FILE", () => {
            test("action with type FILE_UPLOAD_CHANGE_FILE changes file object", () => {
                const startState = {}
                const expectedFileObject = { type: "text", name: "test.txt" }
                const startAction = { type: FILE_UPLOAD_CHANGE_FILE, payload: expectedFileObject }

                const result = UploadFileReducer(startState, startAction)

                expect(result).not.toEqual(startState)
                expect(result.file).toEqual(expectedFileObject)

            })
        })

        describe("FILE_SET_DOWNLOAD_FILE", () => {
            beforeEach(() => {
                URL.revokeObjectURL = jest.fn()
            })
            test("action with type FILE_SET_DOWNLOAD_FILE changes downloadFile object", () => {
                const startState = {
                    displayFile: {
                        isPdf: false,
                        isXml: true,
                        url: "",
                        name: "test.xml"
                    }
                }
                const expectedDownloadObject = { bytes: "text", name: "test.txt" }
                const startAction = { type: FILE_SET_DOWNLOAD_FILE, payload: expectedDownloadObject }

                const result = UploadFileReducer(startState, startAction)

                expect(result).not.toEqual(startState)
                expect(result.downloadFile).toEqual(expectedDownloadObject)

                expect(result.displayFile).toEqual(initialState.displayFile)
            })
            test("action with type FILE_SET_DOWNLOAD_FILE changes removes the displayed file", () => {
                const startState = {
                    displayFile: {
                        isPdf: false,
                        isXml: true,
                        url: "this is a url",
                        name: "test.xml"
                    }
                }
                const expectedDownloadObject = { bytes: "text", name: "test.txt" }
                const startAction = { type: FILE_SET_DOWNLOAD_FILE, payload: expectedDownloadObject }

                const result = UploadFileReducer(startState, startAction)

                expect(result).not.toEqual(startState)
                expect(result.downloadFile).toEqual(expectedDownloadObject)

                expect(result.displayFile).toEqual(initialState.displayFile)
                expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1)
                expect(URL.revokeObjectURL).toHaveBeenCalledWith(startState.displayFile.url)
            })

            afterEach(() => {
                URL.revokeObjectURL = ORIGINAL_URL.revokeObjectURL
            })
        })

        describe("FILE_DISPLAY_FILE", () => {
            beforeEach(() => {
                URL.revokeObjectURL = jest.fn()
                URL.createObjectURL = jest.fn()
            })
            test('action with type FILE_DISPLAY_FILE changes displayFile object', () => {
                const startState = {
                    displayFile: {
                        isPdf: false,
                        isXml: true,
                        url: "",
                        name: "test.xml"
                    }
                }
                const payloadObject = { type: "text", name: "test.txt" }
                const startAction = { type: FILE_DISPLAY_FILE, payload: payloadObject }

                const expectedDisplayFile = getDisplayFileData(payloadObject)
                const result = UploadFileReducer(startState, startAction)

                expect(result).not.toEqual(startState)
                expect(result.displayFile).toEqual(expectedDisplayFile)

            })
            test('action with type FILE_DISPLAY_FILE resets previous displayFile', () => {
                const startState = {
                    displayFile: {
                        isPdf: true,
                        isXml: false,
                        url: "this is a url",
                        name: "test.pdf"
                    }
                }
                const payloadObject = { type: "text", name: "test.txt" }
                const startAction = { type: FILE_DISPLAY_FILE, payload: payloadObject }

                const expectedDisplayFile = getDisplayFileData(payloadObject)
                const result = UploadFileReducer(startState, startAction)

                expect(result).not.toEqual(startState)
                expect(result.displayFile).toEqual(expectedDisplayFile)
                expect(URL.revokeObjectURL).toBeCalledTimes(1)
                expect(URL.revokeObjectURL).toBeCalledWith(startState.displayFile.url)
            })
            afterEach(() => {
                URL.revokeObjectURL = ORIGINAL_URL.revokeObjectURL
                URL.createObjectURL = ORIGINAL_URL.createObjectURL
            })
        })

        describe("FILE_DISPLAY_XML_CONTENT", () => {
            test('action with type FILE_DISPLAY_XML_CONTENT changes displayFile.xmlContent object', () => {
                const startState = {
                    displayFile: {
                        isPdf: false,
                        isXml: true,
                        url: "",
                        name: "test.xml"
                    }
                }
                const payloadObject = "this is the content of the xml file"
                const startAction = { type: FILE_DISPLAY_XML_CONTENT, payload: payloadObject }

                const result = UploadFileReducer(startState, startAction)

                expect(result).not.toEqual(startState)
                expect(result.displayFile.xmlContent).toEqual(payloadObject)
            })
        })

        describe("FILE_DISPLAY_XML_CONTENT", () => {
            beforeEach(() => {
                URL.revokeObjectURL = jest.fn()
            })
            test('action with type STORE_RESET resets back to initial state', () => {
                const startState = {
                    file: {
                        name: "name of the file"
                    },
                    downloadFile: {
                        bytes: "this is a byte string",
                        name: "test.xml"
                    },
                    displayFile: {
                        isPdf: false,
                        isXml: true,
                        url: "",
                        name: "test.xml"
                    }
                }
                const startAction = { type: STORE_RESET }

                const result = UploadFileReducer(startState, startAction)

                expect(result).not.toEqual(startState)
                expect(result).toEqual(initialState)
            })
            test('action with type STORE_RESET resets previous displayFile', () => {
                const startState = {
                    file: {
                        name: "name of the file"
                    },
                    downloadFile: {
                        bytes: "this is a byte string",
                        name: "test.xml"
                    },
                    displayFile: {
                        isPdf: true,
                        isXml: false,
                        url: "this is the url",
                        name: "test.pdf"
                    }
                }
                const startAction = { type: STORE_RESET }

                const result = UploadFileReducer(startState, startAction)

                expect(result).not.toEqual(startState)
                expect(result).toEqual(initialState)

                expect(URL.revokeObjectURL).toBeCalledTimes(1)
                expect(URL.revokeObjectURL).toBeCalledWith(startState.displayFile.url)

            })
            afterEach(() => {
                URL.revokeObjectURL = ORIGINAL_URL.revokeObjectURL
            })
        })

    })
})