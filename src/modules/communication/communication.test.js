import {
    getsigningProfileId,
    createBody,
    validateCertificatesAPI,
    getDataToSignAPI,
    signDocumentAPI,
    validateSignatureAPI, getDataToSignForTokenAPI, sendLogInfo
} from "./communication";
import { getBase64Data } from "../fileUpload/helpers/FileHelper"
import * as filehelper from "../fileUpload/helpers/FileHelper"

const ORIGINAL_Fetch = window.fetch
const REQUEST_FAILED = "REQUEST_FAILED"

const ORIGINAL_getBase64Data = getBase64Data
const BASE64STRING = "BASE64STRING"

describe("getsigningProfileId", () => {

    beforeAll(() => {
        window.configData = {
            defaultSigningProfileId: "XADES_1",
            signingProfileIds: {
                "application/pdf": "PADES_1",
                "application/xml": "XADES_1",
                "text/xml": "XADES_1"
            },
        }
    })

    test("getsigningProfileId returns correct signingprofileId based on MIME-type", () => {
        const expected = "PADES_1"
        const result = getsigningProfileId("application/pdf");

        expect(result).toEqual(expected)
    })

    test("getsigningProfileId returns default signingprofileId", () => {
        const expected = "XADES_1"
        const result = getsigningProfileId("does not exists");

        expect(result).toEqual(expected)
    })
})


describe("createBody", () => {

    beforeAll(() => {
        window.configData = {
            defaultSigningProfileId: "XADES_1",
            signingProfileIds: {
                "application/pdf": "PADES_1",
                "application/xml": "XADES_1",
                "text/xml": "XADES_1"
            },
        }
    })

    test("createBody places objects on the correct place in object", () => {
        const startCertificateObject = {
            certificateChain: [
                { encodedCertificate: "certificatestring" },
                { encodedCertificate: "certificatestring" }
            ],
            signingCertificate: { encodedCertificate: "certificatestring" }
        }
        const startDocumentName = "name of the file"
        const startDocumentBase64 = "base64 string odf document"
        const startDocumentType = "application/xml"
        const expected = {
            "clientSignatureParameters": {
                "certificateChain": startCertificateObject.certificateChain,
                "detachedContents": [],
                "signingCertificate": startCertificateObject.certificate,
                "signingDate": null,
            },
            "signingProfileId": "XADES_1",
            "toSignDocument": {
                "bytes": startDocumentBase64,
                "name": startDocumentName
            }
        }

        const result = createBody(startCertificateObject, startDocumentName, startDocumentBase64, startDocumentType, null)

        expect(result).toEqual(expected)
    })
})


describe('validateCertificatesAPI', () => {

    test("validateCertificatesAPI does correct fetch request", async () => {
        const resultJson = { result: "result" }
        const mockResponse = {
            ok: true,
            json: jest.fn(() => { return resultJson }),
            text: jest.fn()
        }

        const mockPromiseFunction = jest.fn(() => Promise.resolve(mockResponse))

        global.fetch = jest.fn().mockImplementation(mockPromiseFunction);

        const startBody = { value: 1 }
        const result = await validateCertificatesAPI(startBody)

        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch.mock.calls[0][0]).toEqual("/validation/validateCertificates")
        expect(global.fetch.mock.calls[0][1].body).toEqual(JSON.stringify(startBody))
        expect(global.fetch.mock.calls[0][1].method).toEqual('POST')

        expect(mockResponse.json).toBeCalledTimes(1)
        expect(mockResponse.text).toBeCalledTimes(0)
        expect(result).toEqual(resultJson)
    })

    test("validateCertificatesAPI can return text", async () => {
        const resultString = "text"
        const mockResponse = {
            ok: true,
            json: jest.fn(() => { throw 'error' }),
            text: jest.fn(() => { return resultString })
        }

        const mockPromiseFunction = jest.fn(() => Promise.resolve(mockResponse))

        global.fetch = jest.fn().mockImplementation(mockPromiseFunction);

        const startBody = { value: 1 }
        const result = await validateCertificatesAPI(startBody)

        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch.mock.calls[0][0]).toEqual("/validation/validateCertificates")
        expect(global.fetch.mock.calls[0][1].body).toEqual(JSON.stringify(startBody))
        expect(global.fetch.mock.calls[0][1].method).toEqual('POST')
        expect(mockResponse.json).toBeCalledTimes(1)
        expect(mockResponse.text).toBeCalledTimes(1)
        expect(result).toEqual(resultString)
    })

    test("validateCertificatesAPI can throw error", async () => {
        expect.assertions(1)
        const errorResponse = {
            status : 400,
            message: 'SIGN_CERT_EXPIRED',
            error : 'Some err happened'
        };
        const mockResponse = {
            ok: false,
            json: jest.fn(() => Promise.resolve(errorResponse)),
            text: jest.fn(),
            headers : {
                get : jest.fn((headerName) => (headerName === 'content-type'?'application/json':undefined))
            }
        }

        const mockPromiseFunction = jest.fn(() => Promise.resolve(mockResponse))

        global.fetch = jest.fn().mockImplementation(mockPromiseFunction);

        const startBody = { value: 1 }

        try {
            const result = await validateCertificatesAPI(startBody)

            expect(result).toBe(errorResponse);
        }
        catch (e) {
            /*
            expect(e.message).toBe(REQUEST_FAILED)
            expect(global.fetch).toHaveBeenCalledTimes(1)
            expect(global.fetch.mock.calls[0][0]).toEqual("/validation/validateCertificates")
            expect(global.fetch.mock.calls[0][1].body).toEqual(JSON.stringify(startBody))
            expect(global.fetch.mock.calls[0][1].method).toEqual('POST')

            expect(mockResponse.json).toBeCalledTimes(0)
            expect(mockResponse.text).toBeCalledTimes(0)
             */
        }
    })

    afterEach(() => {
        window.fetch = ORIGINAL_Fetch
    })
})


describe('getDataToSignAPI', () => {

    beforeEach(() => {
        filehelper.getBase64Data = jest.fn(() => { return Promise.resolve(BASE64STRING) })

        window.configData = {
            defaultSigningProfileId: "XADES_1",
            signingProfileIds: {
                "application/pdf": "PADES_1",
                "application/xml": "XADES_1",
                "text/xml": "XADES_1"
            },
        }
    })

    test("getDataToSignAPI does correct fetch request", async () => {
        //start var
        const startDocument = { name: "documentName", type: "application/xml" }
        const startCertificateObject = {
            certificateChain: [
                { encodedCertificate: "certificatestring" },
                { encodedCertificate: "certificatestring" }
            ],
            signingCertificate: { encodedCertificate: "certificatestring" }
        }

        //expected
        const expectedBody = createBody(startCertificateObject, startDocument.name, BASE64STRING, startDocument.type)

        //mocking
        const resultJson = { result: "result" }
        const mockResponse = {
            ok: true,
            json: jest.fn(() => { return resultJson }),
            text: jest.fn()
        }

        global.fetch = jest.fn().mockImplementation(() => Promise.resolve(mockResponse));

        //result
        const result = await getDataToSignAPI(startCertificateObject, startDocument)

        //assertions
        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch.mock.calls[0][0]).toEqual("/signing/getDataToSign")
        expect(global.fetch.mock.calls[0][1].body).toEqual(JSON.stringify(expectedBody))
        expect(global.fetch.mock.calls[0][1].method).toEqual('POST')

        expect(mockResponse.json).toBeCalledTimes(1)
        expect(mockResponse.text).toBeCalledTimes(0)
        expect(result).toEqual(resultJson)
    })

    test("validateCertificatesAPI can return text", async () => {

        //start var
        const startDocument = { name: "documentName", type: "application/xml" }
        const startCertificateObject = {
            certificateChain: [
                { encodedCertificate: "certificatestring" },
                { encodedCertificate: "certificatestring" }
            ],
            signingCertificate: { encodedCertificate: "certificatestring" }
        }

        //expected
        const expectedBody = createBody(startCertificateObject, startDocument.name, BASE64STRING, startDocument.type)

        //mocking
        const resultString = "text"
        const mockResponse = {
            ok: true,
            json: jest.fn(() => { throw 'error' }),
            text: jest.fn(() => { return resultString })
        }

        const mockPromiseFunction = jest.fn(() => Promise.resolve(mockResponse))

        global.fetch = jest.fn().mockImplementation(mockPromiseFunction);

        //result
        const result = await getDataToSignAPI(startCertificateObject, startDocument)

        //assertions
        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch.mock.calls[0][0]).toEqual("/signing/getDataToSign")
        expect(global.fetch.mock.calls[0][1].body).toEqual(JSON.stringify(expectedBody))
        expect(global.fetch.mock.calls[0][1].method).toEqual('POST')

        expect(mockResponse.json).toBeCalledTimes(1)
        expect(mockResponse.text).toBeCalledTimes(1)
        expect(result).toEqual(resultString)
    })

    test("validateCertificatesAPI can throw error", async () => {
        expect.assertions(7)
        //start var
        const startDocument = { name: "documentName", type: "application/xml" }
        const startCertificateObject = {
            certificateChain: [
                { encodedCertificate: "certificatestring" },
                { encodedCertificate: "certificatestring" }
            ],
            signingCertificate: { encodedCertificate: "certificatestring" }
        }

        //expected
        const expectedBody = createBody(startCertificateObject, startDocument.name, BASE64STRING, startDocument.type)

        //mocking
        const mockResponse = {
            ok: false,
            json: jest.fn(),
            text: jest.fn()
        }
        global.fetch = jest.fn().mockImplementation(() => Promise.resolve(mockResponse));

        try {
            await getDataToSignAPI(startCertificateObject, startDocument)
        }
        catch (e) {
            expect(e.message).toBe(REQUEST_FAILED)
            expect(global.fetch).toHaveBeenCalledTimes(1)
            expect(global.fetch.mock.calls[0][0]).toEqual("/signing/getDataToSign")
            expect(global.fetch.mock.calls[0][1].body).toEqual(JSON.stringify(expectedBody))
            expect(global.fetch.mock.calls[0][1].method).toEqual('POST')

            expect(mockResponse.json).toBeCalledTimes(0)
            expect(mockResponse.text).toBeCalledTimes(0)
        }

    })

    afterEach(() => {
        window.fetch = ORIGINAL_Fetch
        filehelper.getBase64Data = ORIGINAL_getBase64Data
    })
})


describe('signDocumentAPI', () => {

    beforeEach(() => {
        filehelper.getBase64Data = jest.fn(() => { return Promise.resolve(BASE64STRING) })
        window.configData = {
            defaultSigningProfileId: "XADES_1",
            signingProfileIds: {
                "application/pdf": "PADES_1",
                "application/xml": "XADES_1",
                "text/xml": "XADES_1"
            },
        }
    })

    test("signDocumentAPI does correct fetch request", async () => {
        //start var
        const startDocument = { name: "documentName", type: "application/xml" }
        const startCertificateObject = {
            certificateChain: [
                { encodedCertificate: "certificatestring" },
                { encodedCertificate: "certificatestring" }
            ],
            signingCertificate: { encodedCertificate: "certificatestring" }
        }
        const startSignature = "signature"

        //expected
        const bodyObject = createBody(startCertificateObject, startDocument.name, BASE64STRING, startDocument.type)
        const expectedBody = { ...bodyObject, "signatureValue": startSignature }
        //mocking
        const resultJson = { result: "result" }
        const mockResponse = {
            ok: true,
            json: jest.fn(() => { return resultJson }),
            text: jest.fn()
        }

        global.fetch = jest.fn().mockImplementation(() => Promise.resolve(mockResponse));

        //result
        const result = await signDocumentAPI(startCertificateObject, startDocument, startSignature)

        //assertions
        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch.mock.calls[0][0]).toEqual("/signing/signDocument")
        expect(global.fetch.mock.calls[0][1].body).toEqual(JSON.stringify(expectedBody))
        expect(global.fetch.mock.calls[0][1].method).toEqual('POST')

        expect(mockResponse.json).toBeCalledTimes(1)
        expect(mockResponse.text).toBeCalledTimes(0)
        expect(result).toEqual(resultJson)
    })

    test("signDocumentAPI can return text", async () => {

        //start var
        const startDocument = { name: "documentName", type: "application/xml" }
        const startCertificateObject = {
            certificateChain: [
                { encodedCertificate: "certificatestring" },
                { encodedCertificate: "certificatestring" }
            ],
            signingCertificate: { encodedCertificate: "certificatestring" }
        }
        const startSignature = "signature"

        //expected
        const bodyObject = createBody(startCertificateObject, startDocument.name, BASE64STRING, startDocument.type)
        const expectedBody = { ...bodyObject, "signatureValue": startSignature }

        //mocking
        const resultString = "text"
        const mockResponse = {
            ok: true,
            json: jest.fn(() => { throw 'error' }),
            text: jest.fn(() => { return resultString })
        }

        const mockPromiseFunction = jest.fn(() => Promise.resolve(mockResponse))

        global.fetch = jest.fn().mockImplementation(mockPromiseFunction);

        //result
        const result = await signDocumentAPI(startCertificateObject, startDocument, startSignature)

        //assertions
        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch.mock.calls[0][0]).toEqual("/signing/signDocument")
        expect(global.fetch.mock.calls[0][1].body).toEqual(JSON.stringify(expectedBody))
        expect(global.fetch.mock.calls[0][1].method).toEqual('POST')

        expect(mockResponse.json).toBeCalledTimes(1)
        expect(mockResponse.text).toBeCalledTimes(1)
        expect(result).toEqual(resultString)
    })

    test("signDocumentAPI can throw error", async () => {
        expect.assertions(7)
        //start var
        const startDocument = { name: "documentName", type: "application/xml" }
        const startCertificateObject = {
            certificateChain: [
                { encodedCertificate: "certificatestring" },
                { encodedCertificate: "certificatestring" }
            ],
            signingCertificate: { encodedCertificate: "certificatestring" }
        }
        const startSignature = "signature"

        //expected
        const bodyObject = createBody(startCertificateObject, startDocument.name, BASE64STRING, startDocument.type)
        const expectedBody = { ...bodyObject, "signatureValue": startSignature }

        //mocking
        const mockResponse = {
            ok: false,
            json: jest.fn(),
            text: jest.fn()
        }
        global.fetch = jest.fn().mockImplementation(() => Promise.resolve(mockResponse));

        try {
            await signDocumentAPI(startCertificateObject, startDocument, startSignature)
        }
        catch (e) {
            expect(e.message).toBe(REQUEST_FAILED)
            expect(global.fetch).toHaveBeenCalledTimes(1)
            expect(global.fetch.mock.calls[0][0]).toEqual("/signing/signDocument")
            expect(global.fetch.mock.calls[0][1].body).toEqual(JSON.stringify(expectedBody))
            expect(global.fetch.mock.calls[0][1].method).toEqual('POST')

            expect(mockResponse.json).toBeCalledTimes(0)
            expect(mockResponse.text).toBeCalledTimes(0)
        }
    })

    afterEach(() => {
        window.fetch = ORIGINAL_Fetch
        filehelper.getBase64Data = ORIGINAL_getBase64Data
    })
})



describe('validateSignatureAPI', () => {

    beforeEach(() => {
        filehelper.getBase64Data = jest.fn(() => { return Promise.resolve(BASE64STRING) })
    })

    test("validateSignatureAPI does correct fetch request", async () => {
        //start var
        const startDocument = { name: "documentName", type: "application/xml" }

        //expected
        const expectedBody = {
            "signedDocument": {
                "bytes": BASE64STRING,
                "name": startDocument.name
            }
        }

        //mocking
        const resultJson = { result: "result" }
        const mockResponse = {
            ok: true,
            json: jest.fn(() => { return resultJson }),
            text: jest.fn()
        }

        global.fetch = jest.fn().mockImplementation(() => Promise.resolve(mockResponse));

        //result
        const result = await validateSignatureAPI(startDocument)

        //assertions
        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch.mock.calls[0][0]).toEqual("/validation/validateSignature")
        expect(global.fetch.mock.calls[0][1].body).toEqual(JSON.stringify(expectedBody))
        expect(global.fetch.mock.calls[0][1].method).toEqual('POST')

        expect(mockResponse.json).toBeCalledTimes(1)
        expect(mockResponse.text).toBeCalledTimes(0)
        expect(result).toEqual(resultJson)
    })

    test("signDocumentAPI can return text", async () => {

        //start var
        const startDocument = { name: "documentName", type: "application/xml" }

        //expected
        const expectedBody = {
            "signedDocument": {
                "bytes": BASE64STRING,
                "name": startDocument.name
            }
        }

        //mocking
        const resultString = "text"
        const mockResponse = {
            ok: true,
            json: jest.fn(() => { throw 'error' }),
            text: jest.fn(() => { return resultString })
        }

        const mockPromiseFunction = jest.fn(() => Promise.resolve(mockResponse))

        global.fetch = jest.fn().mockImplementation(mockPromiseFunction);

        //result
        const result = await validateSignatureAPI(startDocument)

        //assertions
        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch.mock.calls[0][0]).toEqual("/validation/validateSignature")
        expect(global.fetch.mock.calls[0][1].body).toEqual(JSON.stringify(expectedBody))
        expect(global.fetch.mock.calls[0][1].method).toEqual('POST')

        expect(mockResponse.json).toBeCalledTimes(1)
        expect(mockResponse.text).toBeCalledTimes(1)
        expect(result).toEqual(resultString)
    })

    test("signDocumentAPI can throw error", async () => {
        expect.assertions(7)
         //start var
         const startDocument = { name: "documentName", type: "application/xml" }

         //expected
         const expectedBody = {
             "signedDocument": {
                 "bytes": BASE64STRING,
                 "name": startDocument.name
             }
         }

        //mocking
        const mockResponse = {
            ok: false,
            json: jest.fn(),
            text: jest.fn()
        }
        global.fetch = jest.fn().mockImplementation(() => Promise.resolve(mockResponse));

        try {
            await validateSignatureAPI(startDocument)
        }
        catch (e) {
            expect(e.message).toBe(REQUEST_FAILED)
            expect(global.fetch).toHaveBeenCalledTimes(1)
            expect(global.fetch.mock.calls[0][0]).toEqual("/validation/validateSignature")
            expect(global.fetch.mock.calls[0][1].body).toEqual(JSON.stringify(expectedBody))
            expect(global.fetch.mock.calls[0][1].method).toEqual('POST')

            expect(mockResponse.json).toBeCalledTimes(0)
            expect(mockResponse.text).toBeCalledTimes(0)
        }
    })

    afterEach(() => {
        window.fetch = ORIGINAL_Fetch
        filehelper.getBase64Data = ORIGINAL_getBase64Data
    })
})

describe('getDataToSignForTokenAPI', () => {
    //mocking
    const resultJson = { result: "result" }
    const mockResponse = {
        ok: true,
        json: jest.fn(() => { return resultJson }),
        text: jest.fn()
    }

    fetch.mockResponseOnce(JSON.stringify(resultJson));

    const startCertificateObject = {
        certificateChain: [
            { encodedCertificate: "certificatestring" },
            { encodedCertificate: "certificatestring" }
        ],
        certificate: { encodedCertificate: "certificatestring" }
    };
    const expectedBody = {
        "clientSignatureParameters": {
            "certificateChain": [
                { encodedCertificate: "certificatestring" },
                { encodedCertificate: "certificatestring" }
            ],
            "detachedContents": [
            ],
            "signingCertificate": { encodedCertificate: "certificatestring" },
            "signingDate": "this value will be replaced later"
        },
        token : '12345456'
    }
    const startToken = '12345456';
    test("fetch called", async () => {
        const result = await getDataToSignForTokenAPI(startCertificateObject, startToken)

        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch.mock.calls[0][0]).toEqual("/signing/getDataToSignForToken")
        //correct the date of the expected body
        let bodyCalled = JSON.parse(global.fetch.mock.calls[0][1].body);
        expectedBody.clientSignatureParameters.signingDate = bodyCalled.clientSignatureParameters.signingDate;
        expect(global.fetch.mock.calls[0][1].body).toEqual(JSON.stringify(expectedBody))
        expect(global.fetch.mock.calls[0][1].method).toEqual('POST')
        expect(result).toEqual(resultJson)
    })

    afterEach(() => {
        window.fetch = ORIGINAL_Fetch
    })

})

describe('calling sendLogInfo', () => {

    test('fetch called', async () => {
        global.fetch.resetMocks();
        sendLogInfo('A message', () => {}, 'the token 12345678');
        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch.mock.calls[0][0]).toEqual("/logging/log")
        let bodyCalled = JSON.parse(global.fetch.mock.calls[0][1].body);
        const expectedBody = {
            "level" : "INFO",
            "message" : 'A message',
            "token" : '12345678'
        }
        expect(global.fetch.mock.calls[0][1].body).toEqual(JSON.stringify(expectedBody))
    });

    test("Don't call CS logging when message is empty string", () => {
        global.fetch.resetMocks();
        sendLogInfo('', () => {},'the token 12345678');
        expect(global.fetch).toHaveBeenCalledTimes(0)
    })
})