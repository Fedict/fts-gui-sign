import * as navigation from "../../wizard/WizardActions"
import { navigateToStep } from "../../wizard/WizardActions"
import {
    navigateToSign,
    checkVersion,
    createCertificateObject,
    getCertificatesFromResponse,
    requestTimeoutFunction,
    requestTimeOutFunctionChecVersion,
    getCertificates,
    validateCertificates,
    validateCertificateChain,
    validateCertificate
} from "./WizardLogicActions"
import { WIZARD_STATE_PIN_INPUT, WIZARD_STATE_SIGNING_PRESIGN_LOADING, WIZARD_STATE_UPLOAD, WIZARD_STATE_VERSION_CHECK_INSTALL, WIZARD_STATE_VERSION_CHECK_UPDATE, WIZARD_STATE_VERSION_CHECK_INSTALL_EXTENSION, WIZARD_STATE_VALIDATE_LOADING, WIZARD_STATE_CERTIFICATES_VALIDATE_CHAIN, WIZARD_STATE_CERTIFICATES_CHOOSE, WIZARD_STATE_DIGEST_LOADING } from "../../wizard/WizardConstants"

import { controller } from "../../eIdLink/controller"
import * as eIDLinkController from "../../eIdLink/controller"

import { createRequestId, removeRequestId } from "../../controlIds/requestId/RequestIdActions"
import * as RequestIdActions from '../../controlIds/requestId/RequestIdActions'

import { readerSetCheck, readerSetOk } from "./ReaderActions"
import * as ReaderActions from './ReaderActions'

import { showErrorMessage } from "../../message/actions/MessageActions"
import * as MessageActions from "../../message/actions/MessageActions"
import { ErrorGeneral } from "../../message/MessageConstants"

import { handleFlowIdError, INCORECT_FLOW_ID } from "../../controlIds/flowId/FlowIdHelpers"
import * as FlowIdHelpers from "../../controlIds/flowId/FlowIdHelpers"

import { handleRequestIdError, INCORECT_REQUEST_ID } from "../../controlIds/requestId/RequestIdHelpers"
import * as RequestIdHelpers from "../../controlIds/requestId/RequestIdHelpers"

import { saveCertificateList, selectCertificate } from "./CertificateActions"
import * as CertificateActions from "./CertificateActions"

import { handleErrorEID, handlePinErrorEID } from "./SignErrorHandleActions"
import * as SignErrorHandleActions from "./SignErrorHandleActions"

import { validateCertificatesAPI, getDataToSignAPI, signDocumentAPI } from "../../communication/communication"
import * as communication from "../../communication/communication"

import { setDigest } from "./DigestActions"
import * as DigestActions from "./DigestActions"

import { setSignature } from "./SignatureActions"
import * as SignatureActions from "./SignatureActions"

import { setDownloadFile } from "../../fileUpload/actions/UploadFileActions"
import * as UploadFileActions from "../../fileUpload/actions/UploadFileActions"

import { resetStore } from "../../../store/storeActions"
import * as storeActions from "../../../store/storeActions"

import { setNewFlowId } from "../../controlIds/flowId/FlowIdActions"
import * as FlowIdActions from "../../controlIds/flowId/FlowIdActions"
import { MessageCertificatesNotFound } from "../messages/MessageCertificatesNotFound"


const ORIGINAL_controller = controller
const ORIGINAL_navigateToStep = navigateToStep
const ORIGINAL_window = { ...window }
const ORIGINAL_createRequestId = createRequestId
const ORIGINAL_removeRequestId = removeRequestId
const ORIGINAL_readerSetCheck = readerSetCheck
const ORIGINAL_readerSetOk = readerSetOk
const ORIGINAL_showErrorMessage = showErrorMessage
const ORIGINAL_handleFlowIdError = handleFlowIdError
const ORIGINAL_handleRequestIdError = handleRequestIdError
const ORIGINAL_saveCertificateList = saveCertificateList
const ORIGINAL_handleErrorEID = handleErrorEID

const ORIGINAL_validateCertificatesAPI = validateCertificatesAPI
const ORIGINAL_selectCertificate = selectCertificate

const ORIGINAL_getDataToSignAPI = getDataToSignAPI
const ORIGINAL_setDigest = setDigest
const ORIGINAL_setSignature = setSignature
const ORIGINAL_handlePinErrorEID = handlePinErrorEID
const ORIGINAL_signDocumentAPI = signDocumentAPI
const ORIGINAL_setDownloadFile = setDownloadFile
const ORIGINAL_resetStore = resetStore
const ORIGINAL_setNewFlowId = setNewFlowId


function flushPromises() {
    return new Promise(resolve => setImmediate(resolve));
}

describe("Pinpad support", () => {

    beforeEach(() => {
        navigation.navigateToStep = jest.fn()

        // Object.defineProperty(window, 'configData', {BEurl: ""})
        global.window.configData = { BEurl: "" }
    })
    test("navigateToSign : navigation to pinpad page", () => {
        const store = {
            certificate: {
                certificateSelected: {
                    readerType: "pinpad"
                }
            }
        }

        const dispatch = jest.fn()
        const getStore = () => { return store }

        navigateToSign()(dispatch, getStore)

        expect(navigation.navigateToStep.mock.calls.length).toBe(1)
        expect(navigation.navigateToStep.mock.calls[0][0]).toBe(WIZARD_STATE_SIGNING_PRESIGN_LOADING)

        expect(dispatch.mock.calls.length).toBe(2)

    })

    test("navigateToSign : navigation to pin input page", () => {
        const store = {
            certificate: {
                certificateSelected: {
                    readerType: "noPinpad"
                }
            }
        }

        const dispatch = jest.fn()
        const getStore = () => { return store }

        navigateToSign()(dispatch, getStore)

        expect(navigation.navigateToStep.mock.calls.length).toBe(1)
        expect(navigation.navigateToStep.mock.calls[0][0]).toBe(WIZARD_STATE_PIN_INPUT)
        expect(dispatch.mock.calls.length).toBe(1)
    })

    afterEach(() => {
        navigation.navigateToStep = ORIGINAL_navigateToStep
    })
})


describe("WizardLogicActions", () => {
    describe("createCertificateObject", () => {
        test("createCertificateObject creates correct object", () => {
            const certificate = "certificateString"
            const certificateChain = {
                rootCA: "certificateStringroot",
                subCA: ['certificatestringsub1', "certificatestringsub2"]
            }
            const result = createCertificateObject(certificate, certificateChain)

            expect(result.certificate).toEqual({ encodedCertificate: certificate })
            expect(result.certificateChain).toContainEqual({ encodedCertificate: certificateChain.rootCA })
            expect(result.certificateChain).toContainEqual({ encodedCertificate: certificateChain.subCA[0] })
            expect(result.certificateChain).toContainEqual({ encodedCertificate: certificateChain.subCA[1] })
            expect(result.certificateChain.length).toBe(3)
        })
        test("createCertificateObject creates correct object without certificate", () => {
            const certificate = undefined
            const certificateChain = {
                rootCA: "certificateStringroot",
                subCA: ['certificatestringsub1', "certificatestringsub2"]
            }
            const result = createCertificateObject(certificate, certificateChain)

            expect(result.certificate).toBeUndefined()
            expect(result.certificateChain).toContainEqual({ encodedCertificate: certificateChain.rootCA })
            expect(result.certificateChain).toContainEqual({ encodedCertificate: certificateChain.subCA[0] })
            expect(result.certificateChain).toContainEqual({ encodedCertificate: certificateChain.subCA[1] })
        })
        test("createCertificateObject creates correct object without certificete chain", () => {
            const certificate = "certificateString"
            const certificateChain = undefined
            const result = createCertificateObject(certificate, certificateChain)

            expect(result.certificate).toEqual({ encodedCertificate: certificate })
            expect(result.certificateChain).toBeUndefined()
        })
        test("createCertificateObject creates correct object without rootCA", () => {
            const certificate = "certificateString"
            const certificateChain = {
                rootCA: undefined,
                subCA: ['certificatestringsub1', "certificatestringsub2"]
            }
            const result = createCertificateObject(certificate, certificateChain)

            expect(result.certificate).toEqual({ encodedCertificate: certificate })
            expect(result.certificateChain).toContainEqual({ encodedCertificate: certificateChain.subCA[0] })
            expect(result.certificateChain).toContainEqual({ encodedCertificate: certificateChain.subCA[1] })
            expect(result.certificateChain.length).toBe(2)
        })
        test("createCertificateObject creates correct object without subCA", () => {
            const certificate = "certificateString"
            const certificateChain = {
                rootCA: "certificateStringroot",
                subCA: undefined
            }
            const result = createCertificateObject(certificate, certificateChain)

            expect(result.certificate).toEqual({ encodedCertificate: certificate })
            expect(result.certificateChain).toContainEqual({ encodedCertificate: certificateChain.rootCA })
            expect(result.certificateChain.length).toBe(1)
        })
        test("createCertificateObject creates correct object with 1 subCA", () => {
            const certificate = "certificateString"
            const certificateChain = {
                rootCA: "certificateStringroot",
                subCA: ['certificatestringsub1']
            }
            const result = createCertificateObject(certificate, certificateChain)

            expect(result.certificate).toEqual({ encodedCertificate: certificate })
            expect(result.certificateChain).toContainEqual({ encodedCertificate: certificateChain.rootCA })
            expect(result.certificateChain).toContainEqual({ encodedCertificate: certificateChain.subCA[0] })
            expect(result.certificateChain.length).toBe(2)
        })
        test("createCertificateObject creates correct object without certificateChain object", () => {
            const certificate = "certificateString"
            const certificateChain = undefined
            const result = createCertificateObject(certificate, certificateChain)

            expect(result.certificate).toEqual({ encodedCertificate: certificate })
            expect(result.certificateChain).toBeUndefined()
        })
    })

    describe("getCertificatesFromResponse", () => {
        test("getCertificatesFromResponse creates correct object without response", () => {
            const result = getCertificatesFromResponse()
            expect(result).toEqual([])
        })
        test("getCertificatesFromResponse creates correct object without response.Readers", () => {
            const response = {}
            const result = getCertificatesFromResponse(response)

            expect(result).toEqual([])
        })
        test("getCertificatesFromResponse creates correct object with response.Readers is empty array", () => {
            const response = {
                Readers: []
            }
            const result = getCertificatesFromResponse(response)

            expect(result).toEqual([])
        })
        test("getCertificatesFromResponse creates correct object with response.Readers with 1 item without certificate array", () => {
            const response = {
                Readers: [{}]
            }
            const result = getCertificatesFromResponse(response)

            expect(result).toEqual([])
        })
        test("getCertificatesFromResponse creates correct object with response.Readers with 1 item with 1 certificate", () => {
            const response = {
                Readers: [{
                    ReaderName: "readerName",
                    ReaderType: "ReaderType",
                    cardType: "cardType",
                    certificates: ["certificateString1"]
                }]
            }
            const result = getCertificatesFromResponse(response)

            const expected = {
                readerName: response.Readers[0].ReaderName,
                readerType: response.Readers[0].ReaderType,
                cardType: response.Readers[0].cardType,
                certificate: response.Readers[0].certificates[0],
                APIBody: createCertificateObject(response.Readers[0].certificates[0])
            }
            expect(result).toHaveLength(1)
            expect(result[0]).toEqual(expected)
        })
        test("getCertificatesFromResponse creates correct object with response.Readers with 1 item with multiple certificates", () => {
            const response = {
                Readers: [{
                    ReaderName: "readerName",
                    ReaderType: "ReaderType",
                    cardType: "cardType",
                    certificates: ["certificateString1", "certificateString2"]
                }]
            }
            const result = getCertificatesFromResponse(response)

            const expected1 = {
                readerName: response.Readers[0].ReaderName,
                readerType: response.Readers[0].ReaderType,
                cardType: response.Readers[0].cardType,
                certificate: response.Readers[0].certificates[0],
                APIBody: createCertificateObject(response.Readers[0].certificates[0])
            }
            const expected2 = {
                readerName: response.Readers[0].ReaderName,
                readerType: response.Readers[0].ReaderType,
                cardType: response.Readers[0].cardType,
                certificate: response.Readers[0].certificates[1],
                APIBody: createCertificateObject(response.Readers[0].certificates[1])
            }
            expect(result).toHaveLength(2)
            expect(result).toContainEqual(expected1)
            expect(result).toContainEqual(expected2)
        })
        test("getCertificatesFromResponse creates correct object with response.Readers with multiple item with 1 certificate", () => {
            const response = {
                Readers: [{
                    ReaderName: "readerName1",
                    ReaderType: "ReaderType1",
                    cardType: "cardType1",
                    certificates: ["certificateString1"]
                }, {
                    ReaderName: "readerName2",
                    ReaderType: "ReaderType2",
                    cardType: "cardType2",
                    certificates: ["certificateString2"]
                }]
            }
            const result = getCertificatesFromResponse(response)

            const expected1 = {
                readerName: response.Readers[0].ReaderName,
                readerType: response.Readers[0].ReaderType,
                cardType: response.Readers[0].cardType,
                certificate: response.Readers[0].certificates[0],
                APIBody: createCertificateObject(response.Readers[0].certificates[0])
            }
            const expected2 = {
                readerName: response.Readers[1].ReaderName,
                readerType: response.Readers[1].ReaderType,
                cardType: response.Readers[1].cardType,
                certificate: response.Readers[1].certificates[0],
                APIBody: createCertificateObject(response.Readers[1].certificates[0])
            }
            expect(result).toHaveLength(2)
            expect(result).toContainEqual(expected1)
            expect(result).toContainEqual(expected2)
        })
    })


    describe("requestTimeoutFunction", () => {
        beforeEach(() => {
            eIDLinkController.controller.getInstance = jest.fn()
        })
        test('requestTimeoutFunction stops eIDLink and checks version of eIDLink', () => {
            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn()
            const mockStop = jest.fn()
            eIDLinkController.controller.getInstance = jest.fn(() => { return { stop: mockStop } })

            requestTimeoutFunction(mockDispatch, mockGetStore)

            expect(mockStop).toBeCalledTimes(1)
            expect(mockDispatch).toBeCalledTimes(1)
            expect(mockDispatch).toBeCalledWith(expect.any(Function))

        })
        afterEach(() => {
            eIDLinkController.controller = ORIGINAL_controller
        })
    })
    describe("requestTimeOutFunctionChecVersion", () => {
        beforeEach(() => {
            eIDLinkController.controller.getInstance = jest.fn()
            window.location.reload = jest.fn()
        })
        test('requestTimeOutFunctionChecVersion stops eIDLink and reloads the page', () => {
            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn()
            const mockStop = jest.fn()
            eIDLinkController.controller.getInstance = jest.fn(() => { return { stop: mockStop } })

            requestTimeOutFunctionChecVersion(mockDispatch, mockGetStore)

            expect(mockStop).toBeCalledTimes(1)
            expect(window.location.reload).toBeCalledTimes(1)

        })
        afterEach(() => {
            eIDLinkController.controller = ORIGINAL_controller
            window = ORIGINAL_window
        })
    })





    describe("checkVersion", () => {
        beforeEach(() => {
            const requestId = 55555
            eIDLinkController.controller.getNewInstance = jest.fn(() => { })
            RequestIdActions.createRequestId = jest.fn(() => { return requestId })
            RequestIdActions.removeRequestId = jest.fn()
            window.configData = { eIDLinkMinimumVersion: "1.0.0" }
            ReaderActions.readerSetCheck = jest.fn();
            ReaderActions.readerSetOk = jest.fn();
            MessageActions.showErrorMessage = jest.fn();
            navigation.navigateToStep = jest.fn();

        })
        test("checkVersion calls the checkversion of eIDLink", () => {
            const mockDispatch = jest.fn((val) => { return val })
            const mockCheckVersion = jest.fn()
            eIDLinkController.controller.getNewInstance = jest.fn(() => { return { getVersion: mockCheckVersion } })

            checkVersion(false)(mockDispatch)
            expect(mockCheckVersion).toBeCalledTimes(1)
        })
        test("checkVersion creates a requestId", () => {
            const requestId = 55555
            RequestIdActions.createRequestId = jest.fn(() => { return requestId })

            const mockDispatch = jest.fn((val) => { return val })
            const mockCheckVersion = jest.fn()
            eIDLinkController.controller.getNewInstance = jest.fn(() => { return { getVersion: mockCheckVersion } })

            checkVersion(false)(mockDispatch)
            expect(RequestIdActions.createRequestId).toBeCalledTimes(1)
            expect(RequestIdActions.createRequestId).toBeCalledWith(4000, expect.any(Function))
            expect(mockDispatch).toBeCalledTimes(1)
            expect(mockCheckVersion).toBeCalledTimes(1)
        })
        test("checkVersion uses correct minimum version", () => {
            const startVersion = "1.0.0"
            window.configData = { eIDLinkMinimumVersion: startVersion }

            const mockDispatch = jest.fn((val) => { return val })
            const mockCheckVersion = jest.fn()
            eIDLinkController.controller.getNewInstance = jest.fn(() => { return { getVersion: mockCheckVersion } })

            checkVersion(false)(mockDispatch)

            expect(mockCheckVersion).toBeCalledTimes(1)
            expect(mockCheckVersion.mock.calls[0][0]).toEqual(startVersion)
        })
        test("checkVersion navigates to FileUpload if version is correct and isErrorCheck is false", () => {
            const requestId = 55555
            RequestIdActions.createRequestId = jest.fn(() => { return requestId })

            const mockDispatch = jest.fn((val) => { return val })
            const mockCheckVersion = jest.fn()
            eIDLinkController.controller.getNewInstance = jest.fn(() => { return { getVersion: mockCheckVersion } })

            checkVersion(false)(mockDispatch)

            expect(mockCheckVersion).toBeCalledTimes(1)
            expect(mockDispatch).toBeCalledTimes(1)

            const versionCorrectCallback = mockCheckVersion.mock.calls[0][1]

            versionCorrectCallback()
            expect(mockDispatch).toBeCalledTimes(5)
            expect(RequestIdActions.removeRequestId).toBeCalled()
            expect(RequestIdActions.removeRequestId).toBeCalledWith(requestId)
            expect(ReaderActions.readerSetCheck).toBeCalled()
            expect(ReaderActions.readerSetCheck).toBeCalledWith(true)
            expect(ReaderActions.readerSetOk).toBeCalled()
            expect(ReaderActions.readerSetOk).toBeCalledWith(true)
            expect(navigation.navigateToStep).toBeCalled()
            expect(navigation.navigateToStep).toBeCalledWith(WIZARD_STATE_UPLOAD)
        })
        test("checkVersion navigates to default error if version is correct and isErrorCheck is true", () => {
            const requestId = 55555
            RequestIdActions.createRequestId = jest.fn(() => { return requestId })

            const mockDispatch = jest.fn((val) => { return val })
            const mockCheckVersion = jest.fn()
            eIDLinkController.controller.getNewInstance = jest.fn(() => { return { getVersion: mockCheckVersion } })

            checkVersion(true)(mockDispatch)

            expect(mockCheckVersion).toBeCalledTimes(1)
            expect(mockDispatch).toBeCalledTimes(1)

            const versionCorrectCallback = mockCheckVersion.mock.calls[0][1]

            versionCorrectCallback()
            expect(mockDispatch).toBeCalledTimes(5)
            expect(RequestIdActions.removeRequestId).toBeCalled()
            expect(RequestIdActions.removeRequestId).toBeCalledWith(requestId)
            expect(ReaderActions.readerSetCheck).toBeCalled()
            expect(ReaderActions.readerSetCheck).toBeCalledWith(true)
            expect(ReaderActions.readerSetOk).toBeCalled()
            expect(ReaderActions.readerSetOk).toBeCalledWith(true)
            expect(navigation.navigateToStep).not.toBeCalled()

            expect(MessageActions.showErrorMessage).toBeCalled()
            expect(MessageActions.showErrorMessage).toBeCalledWith(ErrorGeneral)
        })
        test("checkVersion navigates to eIDLink install if eIDLink native host is not active", () => {
            const requestId = 55555
            RequestIdActions.createRequestId = jest.fn(() => { return requestId })

            const mockDispatch = jest.fn((val) => { return val })
            const mockCheckVersion = jest.fn()
            eIDLinkController.controller.getNewInstance = jest.fn(() => { return { getVersion: mockCheckVersion } })

            checkVersion(false)(mockDispatch)

            expect(mockCheckVersion).toBeCalledTimes(1)
            expect(mockDispatch).toBeCalledTimes(1)

            const versionCorrectCallback = mockCheckVersion.mock.calls[0][2]

            versionCorrectCallback()
            expect(mockDispatch).toBeCalledTimes(5)
            expect(RequestIdActions.removeRequestId).toBeCalled()
            expect(RequestIdActions.removeRequestId).toBeCalledWith(requestId)
            expect(ReaderActions.readerSetCheck).toBeCalled()
            expect(ReaderActions.readerSetCheck).toBeCalledWith(true)
            expect(ReaderActions.readerSetOk).toBeCalled()
            expect(ReaderActions.readerSetOk).toBeCalledWith(false)
            expect(navigation.navigateToStep).toBeCalled()
            expect(navigation.navigateToStep).toBeCalledWith(WIZARD_STATE_VERSION_CHECK_INSTALL)
        })
        test("checkVersion navigates to eIDLink update if eIDLink native host is outdated", () => {
            const requestId = 55555
            RequestIdActions.createRequestId = jest.fn(() => { return requestId })

            const mockDispatch = jest.fn((val) => { return val })
            const mockCheckVersion = jest.fn()
            eIDLinkController.controller.getNewInstance = jest.fn(() => { return { getVersion: mockCheckVersion } })

            checkVersion(false)(mockDispatch)

            expect(mockCheckVersion).toBeCalledTimes(1)
            expect(mockDispatch).toBeCalledTimes(1)

            const versionCorrectCallback = mockCheckVersion.mock.calls[0][3]

            versionCorrectCallback()
            expect(mockDispatch).toBeCalledTimes(5)
            expect(RequestIdActions.removeRequestId).toBeCalled()
            expect(RequestIdActions.removeRequestId).toBeCalledWith(requestId)
            expect(ReaderActions.readerSetCheck).toBeCalled()
            expect(ReaderActions.readerSetCheck).toBeCalledWith(true)
            expect(ReaderActions.readerSetOk).toBeCalled()
            expect(ReaderActions.readerSetOk).toBeCalledWith(false)
            expect(navigation.navigateToStep).toBeCalled()
            expect(navigation.navigateToStep).toBeCalledWith(WIZARD_STATE_VERSION_CHECK_UPDATE)
        })
        test("checkVersion navigates to eIDLink extention install if eIDLink Extention is not found", () => {
            const requestId = 55555
            RequestIdActions.createRequestId = jest.fn(() => { return requestId })

            const mockDispatch = jest.fn((val) => { return val })
            const mockCheckVersion = jest.fn()
            eIDLinkController.controller.getNewInstance = jest.fn(() => { return { getVersion: mockCheckVersion } })

            checkVersion(false)(mockDispatch)

            expect(mockCheckVersion).toBeCalledTimes(1)
            expect(mockDispatch).toBeCalledTimes(1)

            const versionCorrectCallback = mockCheckVersion.mock.calls[0][4]

            versionCorrectCallback()
            expect(mockDispatch).toBeCalledTimes(5)
            expect(RequestIdActions.removeRequestId).toBeCalled()
            expect(RequestIdActions.removeRequestId).toBeCalledWith(requestId)
            expect(ReaderActions.readerSetCheck).toBeCalled()
            expect(ReaderActions.readerSetCheck).toBeCalledWith(true)
            expect(ReaderActions.readerSetOk).toBeCalled()
            expect(ReaderActions.readerSetOk).toBeCalledWith(false)
            expect(navigation.navigateToStep).toBeCalled()
            expect(navigation.navigateToStep).toBeCalledWith(WIZARD_STATE_VERSION_CHECK_INSTALL_EXTENSION)
        })

        afterEach(() => {
            eIDLinkController.controller = ORIGINAL_controller
            RequestIdActions.createRequestId = ORIGINAL_createRequestId
            RequestIdActions.removeRequestId = ORIGINAL_removeRequestId
            ReaderActions.readerSetCheck = ORIGINAL_readerSetCheck
            ReaderActions.readerSetOk = ORIGINAL_readerSetOk
            MessageActions.showErrorMessage = ORIGINAL_showErrorMessage
            navigation.navigateToStep = ORIGINAL_navigateToStep
        })
    })

    describe("getCertificates", () => {
        beforeEach(() => {
            eIDLinkController.controller.getInstance = jest.fn(() => { })
            RequestIdActions.createRequestId = jest.fn(() => { return 55555 })
            RequestIdActions.removeRequestId = jest.fn()
            FlowIdHelpers.handleFlowIdError = jest.fn()
            RequestIdHelpers.handleRequestIdError = jest.fn()
            CertificateActions.saveCertificateList = jest.fn()
            MessageActions.showErrorMessage = jest.fn();
            navigation.navigateToStep = jest.fn();
            SignErrorHandleActions.handleErrorEID = jest.fn();
        })
        test("getCertificates calls getCertificate of eIDLink", () => {
            const mockgetCertificates = jest.fn(() => { return Promise.resolve() })
            eIDLinkController.controller.getInstance = jest.fn(() => { return { getCertificate: mockgetCertificates } })

            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => { return { controlId: { flowId: 20 } } })
            getCertificates()(mockDispatch, mockGetStore)

            expect(mockgetCertificates).toBeCalledTimes(1)

        })
        test("getCertificates creates a requestId", () => {
            const mockgetCertificates = jest.fn(() => { return Promise.resolve() })
            eIDLinkController.controller.getInstance = jest.fn(() => { return { getCertificate: mockgetCertificates } })

            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => { return { controlId: { flowId: 20 } } })
            getCertificates()(mockDispatch, mockGetStore)

            expect(mockDispatch).toBeCalledTimes(1)
            expect(RequestIdActions.createRequestId).toBeCalledTimes(1)
            expect(RequestIdActions.createRequestId).toBeCalledWith(10000, expect.any(Function))
        })
        test("getCertificates succes saves respons in store", async () => {

            const resultGetCertificates = {
                "Readers":
                    [{
                        "ReaderName": "readerName",
                        "ReaderType": "standard",
                        "cardType": "BEID",
                        "certificates": [
                            "certificate string 1",
                            "certificate string 2"]
                    }],
                "result": "OK",
                "correlationId": "5690e32f-0956-4e6e-f2c2-4ce523723ec2",
                "src": "background.js",
                "extensionVersion": "0.0.4"
            }
            const mockgetCertificates = jest.fn(() => { return Promise.resolve(resultGetCertificates) })
            eIDLinkController.controller.getInstance = jest.fn(() => { return { getCertificate: mockgetCertificates } })

            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => { return { controlId: { flowId: 20 } } })

            FlowIdHelpers.handleFlowIdError = jest.fn(() => (value) => { return value })
            RequestIdHelpers.handleRequestIdError = jest.fn(() => (value) => { return value })

            const expectedResult = getCertificatesFromResponse(resultGetCertificates)
            getCertificates()(mockDispatch, mockGetStore)

            await flushPromises();

            expect(mockDispatch).toBeCalledTimes(3)
            expect(CertificateActions.saveCertificateList).toBeCalledTimes(1)
            expect(CertificateActions.saveCertificateList).toBeCalledWith(expectedResult)
        })
        test("getCertificates succes certificateList.length = 0 shows a MessageCertificatesNotFound error", async () => {
            const resultGetCertificates = {
                "Readers": [],
                "result": "OK",
                "correlationId": "5690e32f-0956-4e6e-f2c2-4ce523723ec2",
                "src": "background.js",
                "extensionVersion": "0.0.4"
            }
            const mockgetCertificates = jest.fn(() => { return Promise.resolve(resultGetCertificates) })
            eIDLinkController.controller.getInstance = jest.fn(() => { return { getCertificate: mockgetCertificates } })

            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => { return { controlId: { flowId: 20 } } })

            FlowIdHelpers.handleFlowIdError = jest.fn(() => (value) => { return value })
            RequestIdHelpers.handleRequestIdError = jest.fn(() => (value) => { return value })

            const expectedResult = getCertificatesFromResponse(resultGetCertificates)
            getCertificates()(mockDispatch, mockGetStore)

            await flushPromises();

            expect(mockDispatch).toBeCalledTimes(3)
            expect(CertificateActions.saveCertificateList).toBeCalledTimes(1)
            expect(CertificateActions.saveCertificateList).toBeCalledWith(expectedResult)
            expect(MessageActions.showErrorMessage).toBeCalledTimes(1)
            expect(MessageActions.showErrorMessage).toBeCalledWith(MessageCertificatesNotFound)

        })
        test("getCertificates succes certificateList.length > 0 navigates to certificate validation page", async () => {

            const resultGetCertificates = {
                "Readers":
                    [{
                        "ReaderName": "readerName",
                        "ReaderType": "standard",
                        "cardType": "BEID",
                        "certificates": [
                            "certificate string 1",
                            "certificate string 2"]
                    }],
                "result": "OK",
                "correlationId": "5690e32f-0956-4e6e-f2c2-4ce523723ec2",
                "src": "background.js",
                "extensionVersion": "0.0.4"
            }
            const mockgetCertificates = jest.fn(() => { return Promise.resolve(resultGetCertificates) })
            eIDLinkController.controller.getInstance = jest.fn(() => { return { getCertificate: mockgetCertificates } })

            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => { return { controlId: { flowId: 20 } } })

            FlowIdHelpers.handleFlowIdError = jest.fn(() => (value) => { return value })
            RequestIdHelpers.handleRequestIdError = jest.fn(() => (value) => { return value })

            const expectedResult = getCertificatesFromResponse(resultGetCertificates)
            getCertificates()(mockDispatch, mockGetStore)

            await flushPromises();

            expect(mockDispatch).toBeCalledTimes(3)
            expect(CertificateActions.saveCertificateList).toBeCalledTimes(1)
            expect(CertificateActions.saveCertificateList).toBeCalledWith(expectedResult)

            expect(MessageActions.showErrorMessage).not.toBeCalled()

            expect(navigation.navigateToStep).toBeCalledTimes(1)
            expect(navigation.navigateToStep).toBeCalledWith(WIZARD_STATE_VALIDATE_LOADING)

        })
        test("getCertificates error shows message", async () => {
            const requestId = 55555
            RequestIdActions.createRequestId = jest.fn(() => { return requestId })
            const errorValue = "errorValue"
            const mockgetCertificates = jest.fn(() => { return Promise.reject(errorValue) })
            eIDLinkController.controller.getInstance = jest.fn(() => { return { getCertificate: mockgetCertificates } })

            const mockDispatch = jest.fn((val) => { return val })
            const mockGetStore = jest.fn(() => { return { controlId: { flowId: 20 } } })

            getCertificates()(mockDispatch, mockGetStore)

            await flushPromises();

            expect(mockDispatch).toBeCalledTimes(3)
            expect(RequestIdActions.removeRequestId).toBeCalled()
            expect(RequestIdActions.removeRequestId).toBeCalledTimes(1)
            expect(RequestIdActions.removeRequestId).toBeCalledWith(requestId)
            expect(SignErrorHandleActions.handleErrorEID).toBeCalledTimes(1)
            expect(SignErrorHandleActions.handleErrorEID).toBeCalledWith(errorValue)
            expect(CertificateActions.saveCertificateList).toBeCalledTimes(0)
            expect(MessageActions.showErrorMessage).toBeCalledTimes(0)

        })
        test("getCertificates error INCORECT_REQUEST_ID does nothing", async () => {

            const mockgetCertificates = jest.fn(() => { return Promise.resolve() })
            eIDLinkController.controller.getInstance = jest.fn(() => { return { getCertificate: mockgetCertificates } })

            const mockDispatch = jest.fn((val) => { return val })
            const mockGetStore = jest.fn(() => { return { controlId: { flowId: 20 } } })

            FlowIdHelpers.handleFlowIdError = jest.fn(() => (value) => { return value })
            RequestIdHelpers.handleRequestIdError = jest.fn(() => () => { throw INCORECT_REQUEST_ID })

            getCertificates()(mockDispatch, mockGetStore)

            await flushPromises();

            expect(mockDispatch).toBeCalledTimes(1)
            expect(RequestIdActions.removeRequestId).toBeCalledTimes(0)
            expect(SignErrorHandleActions.handleErrorEID).toBeCalledTimes(0)
            expect(CertificateActions.saveCertificateList).toBeCalledTimes(0)
            expect(MessageActions.showErrorMessage).toBeCalledTimes(0)
        })
        test("getCertificates error INCORECT_FLOW_ID does nothing", async () => {
            const mockgetCertificates = jest.fn(() => { return Promise.resolve() })
            eIDLinkController.controller.getInstance = jest.fn(() => { return { getCertificate: mockgetCertificates } })

            const mockDispatch = jest.fn((val) => { return val })
            const mockGetStore = jest.fn(() => { return { controlId: { flowId: 20 } } })

            FlowIdHelpers.handleFlowIdError = jest.fn(() => () => { throw INCORECT_FLOW_ID })
            RequestIdHelpers.handleRequestIdError = jest.fn(() => (value) => { return value })

            getCertificates()(mockDispatch, mockGetStore)

            await flushPromises();

            expect(mockDispatch).toBeCalledTimes(1)
            expect(RequestIdActions.removeRequestId).toBeCalledTimes(0)
            expect(SignErrorHandleActions.handleErrorEID).toBeCalledTimes(0)
            expect(CertificateActions.saveCertificateList).toBeCalledTimes(0)
            expect(MessageActions.showErrorMessage).toBeCalledTimes(0)
        })
        afterEach(() => {
            eIDLinkController.controller = ORIGINAL_controller
            RequestIdActions.createRequestId = ORIGINAL_createRequestId
            RequestIdActions.removeRequestId = ORIGINAL_removeRequestId
            FlowIdHelpers.handleFlowIdError = ORIGINAL_handleFlowIdError
            RequestIdHelpers.handleRequestIdError = ORIGINAL_handleRequestIdError
            CertificateActions.saveCertificateList = ORIGINAL_saveCertificateList
            MessageActions.showErrorMessage = ORIGINAL_showErrorMessage
            navigation.navigateToStep = ORIGINAL_navigateToStep
            SignErrorHandleActions.handleErrorEID = ORIGINAL_handleErrorEID
        })
    })

    describe("validateCertificates", () => {
        beforeEach(() => {
            communication.validateCertificatesAPI = jest.fn()
            FlowIdHelpers.handleFlowIdError = jest.fn()
            CertificateActions.saveCertificateList = jest.fn()
            MessageActions.showErrorMessage = jest.fn();
            CertificateActions.selectCertificate = jest.fn()
            navigation.navigateToStep = jest.fn()
        })
        test("validateCertificates calls validateCertificatesAPI with the correct body ", () => {
            communication.validateCertificatesAPI = jest.fn(() => { return Promise.resolve() })
            const certificateList = [{
                readerName: 'readerName',
                readerType: 'standard',
                cardType: 'BEID',
                certificate: 'certificate string',
                APIBody: {
                    certificate: {
                        encodedCertificate: 'certificate string'
                    }
                }
            }]

            const expectedCertificateList = certificateList.map(val => {
                return {
                    ...val.APIBody,
                    "expectedKeyUsage": "NON_REPUDIATION"
                }
            })
            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: 88888,
                    certificate: {
                        certificateList: certificateList
                    }
                }
            })
            validateCertificates()(mockDispatch, mockGetStore)

            expect(communication.validateCertificatesAPI).toBeCalledTimes(1)
            expect(communication.validateCertificatesAPI).toBeCalledWith(expectedCertificateList)
        })
        test("validateCertificates doesn't call validateCertificatesAPI if there are no certificates and shows a error message", () => {
            communication.validateCertificatesAPI = jest.fn(() => { return Promise.resolve() })

            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: 88888,
                    certificate: {
                        certificateList: undefined
                    }
                }
            })
            validateCertificates()(mockDispatch, mockGetStore)

            expect(communication.validateCertificatesAPI).toBeCalledTimes(0)
            expect(MessageActions.showErrorMessage).toBeCalledWith(MessageCertificatesNotFound)

        })
        test("validateCertificates succes saves only valid certificates ", async () => {

            const certificateList = [{
                readerName: 'readerName',
                readerType: 'standard',
                cardType: 'BEID',
                certificate: 'certificate string',
                APIBody: {
                    certificate: {
                        encodedCertificate: 'certificate string'
                    }
                }
            }, {
                readerName: 'readerName',
                readerType: 'standard',
                cardType: 'BEID',
                certificate: 'certificate string',
                APIBody: {
                    certificate: {
                        encodedCertificate: 'certificate string'
                    }
                }
            }]

            const certificateResponse = {
                "indications": [{
                    "commonName": "name (Signature)",
                    "indication": "PASSED",
                    "subIndication": null,
                    "keyUsageCheckOk": true
                }, {
                    "commonName": "name (Authentication)",
                    "indication": "PASSED",
                    "subIndication": null,
                    "keyUsageCheckOk": false
                }]
            }

            communication.validateCertificatesAPI = jest.fn(() => { return Promise.resolve(certificateResponse) })
            const expectedCertificateList = certificateList.map(val => {
                return {
                    ...val.APIBody,
                    "expectedKeyUsage": "NON_REPUDIATION"
                }
            })
            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: 88888,
                    certificate: {
                        certificateList: certificateList
                    }
                }
            })
            FlowIdHelpers.handleFlowIdError = jest.fn(() => (value) => { return value })


            validateCertificates()(mockDispatch, mockGetStore)
            await flushPromises();
            expect(communication.validateCertificatesAPI).toBeCalledTimes(1)
            expect(communication.validateCertificatesAPI).toBeCalledWith(expectedCertificateList)
            expect(CertificateActions.saveCertificateList).toBeCalledTimes(1)
            const callParametersCertifictateList = CertificateActions.saveCertificateList.mock.calls[0][0]
            const callParametersCertifictateListPased = callParametersCertifictateList.filter((val) => { return val.keyUsageCheckOk })
            expect(callParametersCertifictateListPased.length).toEqual(1)
        })
        test("validateCertificates succes valid certificates list.length == 0 shows error MessageCertificatesNotFound ", async () => {
            const certificateList = [{
                readerName: 'readerName',
                readerType: 'standard',
                cardType: 'BEID',
                certificate: 'certificate string',
                APIBody: {
                    certificate: {
                        encodedCertificate: 'certificate string'
                    }
                }
            }, {
                readerName: 'readerName',
                readerType: 'standard',
                cardType: 'BEID',
                certificate: 'certificate string',
                APIBody: {
                    certificate: {
                        encodedCertificate: 'certificate string'
                    }
                }
            }]

            const certificateResponse = {
                "indications": [{
                    "commonName": "name (Signature)",
                    "indication": "PASSED",
                    "subIndication": null,
                    "keyUsageCheckOk": false
                }, {
                    "commonName": "name (Authentication)",
                    "indication": "PASSED",
                    "subIndication": null,
                    "keyUsageCheckOk": false
                }]
            }

            communication.validateCertificatesAPI = jest.fn(() => { return Promise.resolve(certificateResponse) })
            const expectedCertificateList = certificateList.map(val => {
                return {
                    ...val.APIBody,
                    "expectedKeyUsage": "NON_REPUDIATION"
                }
            })
            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: 88888,
                    certificate: {
                        certificateList: certificateList
                    }
                }
            })
            FlowIdHelpers.handleFlowIdError = jest.fn(() => (value) => { return value })


            validateCertificates()(mockDispatch, mockGetStore)
            await flushPromises();
            expect(communication.validateCertificatesAPI).toBeCalledTimes(1)
            expect(communication.validateCertificatesAPI).toBeCalledWith(expectedCertificateList)
            expect(CertificateActions.saveCertificateList).toBeCalledTimes(1)
            const callParametersCertifictateList = CertificateActions.saveCertificateList.mock.calls[0][0]
            const callParametersCertifictateListPased = callParametersCertifictateList.filter((val) => { return val.keyUsageCheckOk })
            expect(callParametersCertifictateListPased.length).toEqual(0)

            expect(MessageActions.showErrorMessage).toBeCalledTimes(1)
            expect(MessageActions.showErrorMessage).toBeCalledWith(MessageCertificatesNotFound)

        })
        test("validateCertificates succes valid certificates list.length == 1 selects certificate and navigates to WIZARD_STATE_CERTIFICATES_VALIDATE_CHAIN ", async () => {
            const certificateList = [{
                readerName: 'readerName',
                readerType: 'standard',
                cardType: 'BEID',
                certificate: 'certificate string',
                APIBody: {
                    certificate: {
                        encodedCertificate: 'certificate string'
                    }
                }
            }, {
                readerName: 'readerName',
                readerType: 'standard',
                cardType: 'BEID',
                certificate: 'certificate string',
                APIBody: {
                    certificate: {
                        encodedCertificate: 'certificate string'
                    }
                }
            }]

            const certificateResponse = {
                "indications": [{
                    "commonName": "name (Signature)",
                    "indication": "PASSED",
                    "subIndication": null,
                    "keyUsageCheckOk": true
                }, {
                    "commonName": "name (Authentication)",
                    "indication": "PASSED",
                    "subIndication": null,
                    "keyUsageCheckOk": false
                }]
            }

            communication.validateCertificatesAPI = jest.fn(() => { return Promise.resolve(certificateResponse) })
            const expectedCertificateList = certificateList.map(val => {
                return {
                    ...val.APIBody,
                    "expectedKeyUsage": "NON_REPUDIATION"
                }
            })
            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: 88888,
                    certificate: {
                        certificateList: certificateList
                    }
                }
            })
            FlowIdHelpers.handleFlowIdError = jest.fn(() => (value) => { return value })


            validateCertificates()(mockDispatch, mockGetStore)
            await flushPromises();
            expect(communication.validateCertificatesAPI).toBeCalledTimes(1)
            expect(communication.validateCertificatesAPI).toBeCalledWith(expectedCertificateList)
            expect(CertificateActions.saveCertificateList).toBeCalledTimes(1)
            const callParametersCertifictateList = CertificateActions.saveCertificateList.mock.calls[0][0]
            const callParametersCertifictateListPased = callParametersCertifictateList.filter((val) => { return val.keyUsageCheckOk })
            expect(callParametersCertifictateListPased.length).toEqual(1)

            expect(CertificateActions.selectCertificate).toBeCalledTimes(1)
            expect(CertificateActions.selectCertificate).toBeCalledWith(callParametersCertifictateListPased[0])

            expect(navigation.navigateToStep).toBeCalledTimes(1)
            expect(navigation.navigateToStep).toBeCalledWith(WIZARD_STATE_CERTIFICATES_VALIDATE_CHAIN)


        })
        test("validateCertificates succes valid certificates list.length > 1 navigates to WIZARD_STATE_CERTIFICATES_CHOOSE ", async () => {
            const certificateList = [{
                readerName: 'readerName',
                readerType: 'standard',
                cardType: 'BEID',
                certificate: 'certificate string',
                APIBody: {
                    certificate: {
                        encodedCertificate: 'certificate string'
                    }
                }
            }, {
                readerName: 'readerName',
                readerType: 'standard',
                cardType: 'BEID',
                certificate: 'certificate string',
                APIBody: {
                    certificate: {
                        encodedCertificate: 'certificate string'
                    }
                }
            }]

            const certificateResponse = {
                "indications": [{
                    "commonName": "name (Signature)",
                    "indication": "PASSED",
                    "subIndication": null,
                    "keyUsageCheckOk": true
                }, {
                    "commonName": "name (Authentication)",
                    "indication": "PASSED",
                    "subIndication": null,
                    "keyUsageCheckOk": true
                }]
            }

            communication.validateCertificatesAPI = jest.fn(() => { return Promise.resolve(certificateResponse) })
            const expectedCertificateList = certificateList.map(val => {
                return {
                    ...val.APIBody,
                    "expectedKeyUsage": "NON_REPUDIATION"
                }
            })
            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: 88888,
                    certificate: {
                        certificateList: certificateList
                    }
                }
            })
            FlowIdHelpers.handleFlowIdError = jest.fn(() => (value) => { return value })


            validateCertificates()(mockDispatch, mockGetStore)
            await flushPromises();
            expect(communication.validateCertificatesAPI).toBeCalledTimes(1)
            expect(communication.validateCertificatesAPI).toBeCalledWith(expectedCertificateList)
            expect(CertificateActions.saveCertificateList).toBeCalledTimes(1)
            const callParametersCertifictateList = CertificateActions.saveCertificateList.mock.calls[0][0]
            const callParametersCertifictateListPased = callParametersCertifictateList.filter((val) => { return val.keyUsageCheckOk })
            expect(callParametersCertifictateListPased.length).toEqual(2)

            expect(CertificateActions.selectCertificate).not.toBeCalled()
            expect(CertificateActions.selectCertificate).not.toBeCalledWith(callParametersCertifictateListPased[0])

            expect(navigation.navigateToStep).toBeCalledTimes(1)
            expect(navigation.navigateToStep).toBeCalledWith(WIZARD_STATE_CERTIFICATES_CHOOSE)
        })
        test("validateCertificates error shows message", async () => {
            const certificateList = [{
                readerName: 'readerName',
                readerType: 'standard',
                cardType: 'BEID',
                certificate: 'certificate string',
                APIBody: {
                    certificate: {
                        encodedCertificate: 'certificate string'
                    }
                }
            }, {
                readerName: 'readerName',
                readerType: 'standard',
                cardType: 'BEID',
                certificate: 'certificate string',
                APIBody: {
                    certificate: {
                        encodedCertificate: 'certificate string'
                    }
                }
            }]

            communication.validateCertificatesAPI = jest.fn(() => { return Promise.reject() })
            const expectedCertificateList = certificateList.map(val => {
                return {
                    ...val.APIBody,
                    "expectedKeyUsage": "NON_REPUDIATION"
                }
            })
            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: 88888,
                    certificate: {
                        certificateList: certificateList
                    }
                }
            })
            FlowIdHelpers.handleFlowIdError = jest.fn(() => (value) => { return value })


            validateCertificates()(mockDispatch, mockGetStore)
            await flushPromises();
            expect(communication.validateCertificatesAPI).toBeCalledTimes(1)
            expect(communication.validateCertificatesAPI).toBeCalledWith(expectedCertificateList)

            expect(MessageActions.showErrorMessage).toBeCalledWith(MessageCertificatesNotFound)


        })
        test("validateCertificates error INCORECT_FLOW_ID does nothing", async () => {
            const certificateList = [{
                readerName: 'readerName',
                readerType: 'standard',
                cardType: 'BEID',
                certificate: 'certificate string',
                APIBody: {
                    certificate: {
                        encodedCertificate: 'certificate string'
                    }
                }
            }, {
                readerName: 'readerName',
                readerType: 'standard',
                cardType: 'BEID',
                certificate: 'certificate string',
                APIBody: {
                    certificate: {
                        encodedCertificate: 'certificate string'
                    }
                }
            }]

            const certificateResponse = {
                "indications": [{
                    "commonName": "name (Signature)",
                    "indication": "PASSED",
                    "subIndication": null,
                    "keyUsageCheckOk": true
                }, {
                    "commonName": "name (Authentication)",
                    "indication": "PASSED",
                    "subIndication": null,
                    "keyUsageCheckOk": true
                }]
            }

            communication.validateCertificatesAPI = jest.fn(() => { return Promise.resolve(certificateResponse) })

            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: 88888,
                    certificate: {
                        certificateList: certificateList
                    }
                }
            })
            FlowIdHelpers.handleFlowIdError = jest.fn(() => () => { throw INCORECT_FLOW_ID })

            validateCertificates()(mockDispatch, mockGetStore)

            await flushPromises();

            expect(communication.validateCertificatesAPI).toBeCalledTimes(1)
            expect(CertificateActions.saveCertificateList).not.toBeCalled()
            expect(CertificateActions.selectCertificate).not.toBeCalled()
            expect(navigation.navigateToStep).not.toBeCalled()

        })
        afterEach(() => {
            communication.validateCertificatesAPI = ORIGINAL_validateCertificatesAPI
            FlowIdHelpers.handleFlowIdError = ORIGINAL_handleFlowIdError
            CertificateActions.saveCertificateList = ORIGINAL_saveCertificateList
            MessageActions.showErrorMessage = ORIGINAL_showErrorMessage
            CertificateActions.selectCertificate = ORIGINAL_selectCertificate
            navigation.navigateToStep = ORIGINAL_navigateToStep
        })
    })

    describe("validateCertificateChain", () => {
        beforeEach(() => {
            eIDLinkController.controller.getInstance = jest.fn(() => { })
            RequestIdActions.createRequestId = jest.fn(() => { return 55555 })
            FlowIdHelpers.handleFlowIdError = jest.fn((val) => { return val })
            RequestIdHelpers.handleRequestIdError = jest.fn((val) => { return val })
            RequestIdActions.removeRequestId = jest.fn()
            SignErrorHandleActions.handleErrorEID = jest.fn();
            communication.validateCertificatesAPI = jest.fn(() => { return Promise.resolve() });
        })
        test("validateCertificateChain doesn't call eIDLink getCertificateChain if there is no selectedCertificate",
            async () => {
                const mockvalidateCertificateChain = jest.fn(() => { return Promise.resolve() })
                eIDLinkController.controller.getInstance = jest.fn(() => ({ getCertificateChain: mockvalidateCertificateChain }))
                const mockDispatch = jest.fn()
                const mockGetStore = jest.fn(() => {
                    return {
                        controlId: 88888,
                        certificate: undefined
                    }
                })
                validateCertificateChain()(mockDispatch, mockGetStore)
                await flushPromises();

                expect(mockvalidateCertificateChain).not.toBeCalled()

            })
        test("validateCertificateChain calls getCertificateChain", async () => {
            const mockvalidateCertificateChain = jest.fn(() => { return Promise.resolve() })
            eIDLinkController.controller.getInstance = jest.fn(() => ({ getCertificateChain: mockvalidateCertificateChain }))

            const certificateString = "certificate string"
            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: 88888,
                    certificate: {
                        certificateSelected:
                            { certificate: certificateString }
                    }
                }
            })
            validateCertificateChain()(mockDispatch, mockGetStore)
            await flushPromises()
            expect(mockvalidateCertificateChain).toBeCalledTimes(1)
            expect(mockvalidateCertificateChain).toBeCalledWith(expect.any(String), expect.any(String), certificateString)
        })
        test("validateCertificateChain creates a requestId of 10000ms", async () => {
            const mockvalidateCertificateChain = jest.fn(() => { return Promise.resolve() })
            eIDLinkController.controller.getInstance = jest.fn(() => ({ getCertificateChain: mockvalidateCertificateChain }))

            const certificateString = "certificate string"
            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: 88888,
                    certificate: {
                        certificateSelected:
                            { certificate: certificateString }
                    }
                }
            })
            validateCertificateChain()(mockDispatch, mockGetStore)
            await flushPromises()
            expect(RequestIdActions.createRequestId).toBeCalledTimes(1)
            expect(RequestIdActions.createRequestId).toBeCalledWith(10000, requestTimeoutFunction)
        })
        test("validateCertificateChain succes calls handleFlowIdError", async () => {
            const flowId = 88888
            const mockvalidateCertificateChain = jest.fn(() => { return Promise.resolve() })
            eIDLinkController.controller.getInstance = jest.fn(() => ({ getCertificateChain: mockvalidateCertificateChain }))

            const certificateString = "certificate string"
            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: {
                        flowId: flowId,
                        requestId: []
                    },
                    certificate: {
                        certificateSelected:
                            { certificate: certificateString }
                    }
                }
            })

            FlowIdHelpers.handleFlowIdError = jest.fn(() => (val) => { return val })
            validateCertificateChain()(mockDispatch, mockGetStore)
            await flushPromises()
            expect(FlowIdHelpers.handleFlowIdError).toBeCalledTimes(1)
            expect(FlowIdHelpers.handleFlowIdError).toBeCalledWith(flowId, expect.any(Function))

        })
        test("validateCertificateChain succes calls handleRequestIdError", async () => {
            const requestId = 88888
            RequestIdActions.createRequestId = jest.fn(() => { return requestId })
            const mockvalidateCertificateChain = jest.fn(() => { return Promise.resolve() })
            eIDLinkController.controller.getInstance = jest.fn(() => ({ getCertificateChain: mockvalidateCertificateChain }))

            const certificateString = "certificate string"
            const mockDispatch = jest.fn((val) => { return val })
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: {
                        flowId: 88888,
                        requestId: []
                    },
                    certificate: {
                        certificateSelected:
                            { certificate: certificateString }
                    }
                }
            })

            FlowIdHelpers.handleFlowIdError = jest.fn(() => (val) => { return val })
            RequestIdHelpers.handleRequestIdError = jest.fn(() => (val) => { return val })
            validateCertificateChain()(mockDispatch, mockGetStore)
            await flushPromises()
            expect(RequestIdHelpers.handleRequestIdError).toBeCalledTimes(1)
            expect(RequestIdHelpers.handleRequestIdError).toBeCalledWith(requestId, expect.any(Function), expect.any(Function))
        })
        test("validateCertificateChain succes calls validateCertificate with certificate chain", async () => {

            const mockvalidateCertificateChainResponse = {
                "certificateChain": {
                    "rootCA": "rootCa string",
                    "subCA": ["subCa string"]
                },
                "cardType": "BEID",
                "result": "OK",
                "correlationId": "6d51287a-fddf-bf63-59a9-da55debe3baf",
                "src": "background.js",
                "extensionVersion": "0.0.4"
            }
            const mockvalidateCertificateChain = jest.fn(() => { return Promise.resolve(mockvalidateCertificateChainResponse) })
            eIDLinkController.controller.getInstance = jest.fn(() => ({ getCertificateChain: mockvalidateCertificateChain }))


            const certificateString = "certificate string"
            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: {
                        flowId: 77777,
                        requestId: []
                    },
                    certificate: {
                        certificateSelected:
                            { certificate: certificateString }
                    }
                }
            })
            const expectedValue = [{
                ...createCertificateObject(certificateString, mockvalidateCertificateChainResponse.certificateChain),
                "expectedKeyUsage": "NON_REPUDIATION"
            }]

            FlowIdHelpers.handleFlowIdError = jest.fn(() => (val) => { return val })
            RequestIdHelpers.handleRequestIdError = jest.fn(() => (val) => { return val })
            validateCertificateChain()(mockDispatch, mockGetStore)
            await flushPromises()
            mockDispatch.mock.calls[1][0](jest.fn(), jest.fn(() => ({ controlId: { flowId: 77777 } })))
            expect(communication.validateCertificatesAPI).toBeCalled()
            expect(communication.validateCertificatesAPI).toBeCalledWith(expectedValue)


        })
        test("validateCertificateChain error shows message", async () => {

            const mockvalidateCertificateChain = jest.fn(() => { return Promise.reject() })
            eIDLinkController.controller.getInstance = jest.fn(() => ({ getCertificateChain: mockvalidateCertificateChain }))


            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: {
                        flowId: 77777,
                        requestId: []
                    },
                    certificate: {
                        certificateSelected:
                            { certificate: "certificate string" }
                    }
                }
            })


            FlowIdHelpers.handleFlowIdError = jest.fn(() => (val) => { return val })
            RequestIdHelpers.handleRequestIdError = jest.fn(() => (val) => { return val })
            validateCertificateChain()(mockDispatch, mockGetStore)
            await flushPromises()
            expect(RequestIdActions.removeRequestId).toBeCalledTimes(1)
            expect(SignErrorHandleActions.handleErrorEID).toBeCalledTimes(1)
        })
        test("validateCertificateChain error INCORECT_FLOW_ID  does nothing", async () => {
            const mockvalidateCertificateChain = jest.fn(() => { return Promise.resolve() })
            eIDLinkController.controller.getInstance = jest.fn(() => ({ getCertificateChain: mockvalidateCertificateChain }))


            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: {
                        flowId: 88888,
                        requestId: []
                    },
                    certificate: {
                        certificateSelected:
                            { certificate: "certificatestring" }
                    }
                }
            })


            FlowIdHelpers.handleFlowIdError = jest.fn(() => (val) => { throw INCORECT_FLOW_ID })
            RequestIdHelpers.handleRequestIdError = jest.fn(() => (val) => { return val })
            validateCertificateChain()(mockDispatch, mockGetStore)
            await flushPromises()
            expect(RequestIdActions.removeRequestId).not.toBeCalled()
            expect(SignErrorHandleActions.handleErrorEID).not.toBeCalled()
        })
        test("validateCertificateChain error INCORECT_FLOW_ID does nothing", async () => {
            const mockvalidateCertificateChain = jest.fn(() => { return Promise.resolve() })
            eIDLinkController.controller.getInstance = jest.fn(() => ({ getCertificateChain: mockvalidateCertificateChain }))


            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: {
                        flowId: 88888,
                        requestId: []
                    },
                    certificate: {
                        certificateSelected:
                            { certificate: "certificatestring" }
                    }
                }
            })


            FlowIdHelpers.handleFlowIdError = jest.fn(() => (val) => { return val })
            RequestIdHelpers.handleRequestIdError = jest.fn(() => (val) => { throw INCORECT_REQUEST_ID })
            validateCertificateChain()(mockDispatch, mockGetStore)
            await flushPromises()
            expect(RequestIdActions.removeRequestId).not.toBeCalled()
            expect(SignErrorHandleActions.handleErrorEID).not.toBeCalled()
        })

        afterEach(() => {
            eIDLinkController.controller = ORIGINAL_controller
            RequestIdActions.createRequestId = ORIGINAL_createRequestId
            FlowIdHelpers.handleFlowIdError = ORIGINAL_handleFlowIdError
            RequestIdHelpers.handleRequestIdError = ORIGINAL_handleRequestIdError
            RequestIdActions.removeRequestId = ORIGINAL_removeRequestId
            SignErrorHandleActions.handleErrorEID = ORIGINAL_handleErrorEID
            communication.validateCertificatesAPI = ORIGINAL_validateCertificatesAPI
        })
    })

    describe("validateCertificate", () => {
        beforeEach(() => {
            communication.validateCertificatesAPI = jest.fn(() => { return Promise.resolve() })
            FlowIdHelpers.handleFlowIdError = jest.fn(() => (val) => { return val })
            CertificateActions.selectCertificate = jest.fn()
            navigation.navigateToStep = jest.fn()
            MessageActions.showErrorMessage = jest.fn();
        })
        test("validateCertificates calls validateCertificatesAPI with the correct body ", async () => {
            const startValue = {
                APIBody: {
                    certificate: {
                        encodedCertificate: 'certificateString'
                    },
                    certificateChain: [
                        { encodedCertificate: 'certificate chain string 1' },
                        { encodedCertificate: 'certificate chain string 2' }
                    ]
                }
            }
            const expectedResult = [{
                ...startValue.APIBody,
                "expectedKeyUsage": "NON_REPUDIATION"
            }]

            const mockDispatch = jest.fn()
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: {
                        flowId: 88888,
                        requestId: []
                    }
                }
            })
            validateCertificate(startValue)(mockDispatch, mockGetStore)
            await flushPromises()
            expect(communication.validateCertificatesAPI).toBeCalledTimes(1)
            expect(communication.validateCertificatesAPI).toBeCalledWith(expectedResult)
        })
        test("validateCertificates succes certificate valid selects certificate and navigates to WIZARD_STATE_DIGEST_LOADING ", async () => {
            const startValue = {
                APIBody: {
                    certificate: {
                        encodedCertificate: 'certificateString'
                    },
                    certificateChain: [
                        { encodedCertificate: 'certificate chain string 1' },
                        { encodedCertificate: 'certificate chain string 2' }
                    ]
                }
            }


            const mockvalidateCertificateChainresponse = {
                "indications": [{
                    "commonName": "name(Signature)",
                    "indication": "PASSED",
                    "subIndication": null,
                    "keyUsageCheckOk": true
                }]
            }
            communication.validateCertificatesAPI = jest.fn(() => { return Promise.resolve(mockvalidateCertificateChainresponse) })

            const expectedResult = {
                ...startValue,
                indication: mockvalidateCertificateChainresponse.indications[0].indication,
                keyUsageCheckOk: mockvalidateCertificateChainresponse.indications[0].keyUsageCheckOk,
                commonName: mockvalidateCertificateChainresponse.indications[0].commonName
            }
            const mockDispatch = jest.fn((val) => val)
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: {
                        flowId: 88888,
                        requestId: []
                    }
                }
            })
            validateCertificate(startValue)(mockDispatch, mockGetStore)
            await flushPromises()
            expect(CertificateActions.selectCertificate).toBeCalledTimes(1)
            expect(CertificateActions.selectCertificate.mock.calls[0][0]).toMatchObject(expectedResult)
            expect(navigation.navigateToStep).toBeCalledWith(WIZARD_STATE_DIGEST_LOADING)
        })
        test("validateCertificates succes certificate not valid shows MessageCertificatesNotFound", async () => {
            const startValue = {
                APIBody: {
                    certificate: {
                        encodedCertificate: 'certificateString'
                    },
                    certificateChain: [
                        { encodedCertificate: 'certificate chain string 1' },
                        { encodedCertificate: 'certificate chain string 2' }
                    ]
                }
            }


            const mockvalidateCertificateChainresponse = {
                "indications": [{
                    "commonName": "name(Signature)",
                    "indication": "FAILED",
                    "subIndication": null,
                    "keyUsageCheckOk": true
                }]
            }
            communication.validateCertificatesAPI = jest.fn(() => { return Promise.resolve(mockvalidateCertificateChainresponse) })

            const mockDispatch = jest.fn((val) => val)
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: {
                        flowId: 88888,
                        requestId: []
                    }
                }
            })
            validateCertificate(startValue)(mockDispatch, mockGetStore)
            await flushPromises()
            expect(CertificateActions.selectCertificate).toBeCalledTimes(0)
            expect(MessageActions.showErrorMessage).toBeCalledWith(MessageCertificatesNotFound)
        })

        test("validateCertificates error shows MessageCertificatesNotFound", async () => {
            const startValue = {
                APIBody: {
                    certificate: {
                        encodedCertificate: 'certificateString'
                    },
                    certificateChain: [
                        { encodedCertificate: 'certificate chain string 1' },
                        { encodedCertificate: 'certificate chain string 2' }
                    ]
                }
            }


            communication.validateCertificatesAPI = jest.fn(() => { return Promise.reject() })

            const mockDispatch = jest.fn((val) => val)
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: {
                        flowId: 88888,
                        requestId: []
                    }
                }
            })
            validateCertificate(startValue)(mockDispatch, mockGetStore)
            await flushPromises()
            expect(MessageActions.showErrorMessage).toBeCalledWith(MessageCertificatesNotFound)
        })
        test("validateCertificates error INCORECT_FLOW_ID does nothing", async () => {
            const startValue = {
                APIBody: {
                    certificate: {
                        encodedCertificate: 'certificateString'
                    },
                    certificateChain: [
                        { encodedCertificate: 'certificate chain string 1' },
                        { encodedCertificate: 'certificate chain string 2' }
                    ]
                }
            }


            communication.validateCertificatesAPI = jest.fn(() => { return Promise.resolve() })

            const mockDispatch = jest.fn((val) => val)
            const mockGetStore = jest.fn(() => {
                return {
                    controlId: {
                        flowId: 88888,
                        requestId: []
                    }
                }
            })

            FlowIdHelpers.handleFlowIdError = jest.mock(() => () => { throw INCORECT_FLOW_ID })
            validateCertificate(startValue)(mockDispatch, mockGetStore)
            await flushPromises()
            expect(MessageActions.showErrorMessage).not.toBeCalled()
        })
        afterEach(() => {
            communication.validateCertificatesAPI = ORIGINAL_validateCertificatesAPI
            FlowIdHelpers.handleFlowIdError = ORIGINAL_handleFlowIdError
            CertificateActions.selectCertificate = ORIGINAL_selectCertificate
            navigation.navigateToStep = ORIGINAL_navigateToStep
            MessageActions.showErrorMessage = ORIGINAL_showErrorMessage
        })
    })

    describe("getDigest", () => {
        beforeEach(() => {
            communication.getDataToSignAPI = jest.fn()
            FlowIdHelpers.handleFlowIdError = jest.fn()
            DigestActions.setDigest = jest.fn()
            MessageActions.showErrorMessage = jest.fn();
        })
        test("getDigest doesn't call getDataToSignAPI when no selected certificate", () => { })
        test("getDigest calls getDataToSignAPI", () => { })
        test("getDigest succes calls handleFlowIdError", () => { })
        test("getDigest succes sets digist in store", () => { })
        test("getDigest succes navigates to sign", () => { })
        test("getDigest error shows message", () => { })
        test("getDigest error INCORECT_FLOW_ID does nothing", () => { })
        afterEach(() => {
            communication.getDataToSignAPI = ORIGINAL_getDataToSignAPI
            FlowIdHelpers.handleFlowIdError = ORIGINAL_handleFlowIdError
            DigestActions.setDigest = ORIGINAL_setDigest
            MessageActions.showErrorMessage = ORIGINAL_showErrorMessage
        })
    })

    describe("navigateToSign", () => {
        beforeEach(() => {
            navigation.navigateToStep = jest.fn()
            MessageActions.showErrorMessage = jest.fn();
        })
        test("navigateToSign shows ErrorGeneral if no certificateSelected", () => { })
        test("navigateToSign pinpad reader navigates to WIZARD_STATE_SIGNING_PRESIGN_LOADING and calls sign(null)", () => { })
        test("navigateToSign no pinpad reader navigates to WIZARD_STATE_PIN_INPUT", () => { })
        afterEach(() => {
            navigation.navigateToStep = ORIGINAL_navigateToStep
            MessageActions.showErrorMessage = ORIGINAL_showErrorMessage;
        })
    })

    describe("navigateToPinError", () => {
        beforeEach(() => {
            navigation.navigateToStep = jest.fn()
            MessageActions.showErrorMessage = jest.fn();
        })
        test("navigateToPinError shows ErrorGeneral if no certificateSelected", () => { })
        test("navigateToPinError pinpad navigates to WIZARD_STATE_PINPAD_ERROR", () => { })
        test("navigateToPinError no pinpad navigates to WIZARD_STATE_PIN_INPUT", () => { })
        afterEach(() => {
            navigation.navigateToStep = ORIGINAL_navigateToStep
            MessageActions.showErrorMessage = ORIGINAL_showErrorMessage;
        })
    })

    describe("sign", () => {
        beforeEach(() => {
            eIDLinkController.controller.getInstance = jest.fn(() => { })
            RequestIdActions.createRequestId = jest.fn(() => { return 55555 })
            FlowIdHelpers.handleFlowIdError = jest.fn()
            RequestIdHelpers.handleRequestIdError = jest.fn()
            SignatureActions.setSignature = jest.fn()
            RequestIdActions.removeRequestId = jest.fn()
            SignErrorHandleActions.handlePinErrorEID = jest.fn()
            MessageActions.showErrorMessage = jest.fn();
        })
        test("sign shows ErrorGeneral when no selected certificate or digest", () => { })
        test("sign pinpad creates a requestId of 30000ms", () => { })
        test("sign no pinpad creates a requestId of 10000ms", () => { })
        test("sign calls eIDLink sign", () => { })
        test("sign succes calls handleFlowIdError", () => { })
        test("sign succes calls handleRequestIdError", () => { })
        test("sign succes saves signature ", () => { })
        test("sign succes saves calls signDocument", () => { })
        test("sign error shows message", () => { })
        test("sign error INCORECT_REQUEST_ID does nothing", () => { })
        test("sign error INCORECT_FLOW_ID does nothing", () => { })

        afterEach(() => {
            eIDLinkController.controller = ORIGINAL_controller
            RequestIdActions.createRequestId = ORIGINAL_createRequestId
            FlowIdHelpers.handleFlowIdError = ORIGINAL_handleFlowIdError
            RequestIdHelpers.handleRequestIdError = ORIGINAL_handleRequestIdError
            SignatureActions.setSignature = ORIGINAL_setSignature
            RequestIdActions.removeRequestId = ORIGINAL_removeRequestId
            SignErrorHandleActions.handlePinErrorEID = ORIGINAL_handlePinErrorEID
            MessageActions.showErrorMessage = ORIGINAL_showErrorMessage
        })
    })

    describe("signDocument", () => {
        beforeEach(() => {
            navigation.navigateToStep = jest.fn()
            communication.signDocumentAPI = jest.fn()
            FlowIdHelpers.handleFlowIdError = jest.fn()
            UploadFileActions.setDownloadFile = jest.fn()
            MessageActions.showErrorMessage = jest.fn();
        })
        test("signDocument shows ErrorGeneral when not all data is present", () => { })
        test("signDocument navigates to WIZARD_STATE_SIGNING_LOADING", () => { })
        test("signDocument calls signDocumentAPI", () => { })
        test("signDocument succes handleFlowIdError", () => { })
        test("signDocument succes setDownloadFile", () => { })
        test("signDocument succes navigates to WIZARD_STATE_SUCCES", () => { })
        test("signDocument succes shows ErrorGeneral when not all data is present ", () => { })
        test("signDocument error shows message", () => { })
        test("signDocument error INCORECT_FLOW_ID does nothing", () => { })
        afterEach(() => {
            navigation.navigateToStep = ORIGINAL_navigateToStep
            communication.signDocumentAPI = ORIGINAL_signDocumentAPI
            FlowIdHelpers.handleFlowIdError = ORIGINAL_handleFlowIdError
            UploadFileActions.setDownloadFile = ORIGINAL_setDownloadFile
            MessageActions.showErrorMessage = ORIGINAL_showErrorMessage
        })
    })

    describe("resetWizard", () => {
        beforeEach(() => {
            eIDLinkController.controller.getInstance = jest.fn(() => { })
            storeActions.resetStore = jest.fn(() => { })
            FlowIdActions.setNewFlowId = jest.fn(() => { })
            navigation.navigateToStep = jest.fn()
        })
        test("resetWizard resetStore and creates new flowId", () => {

        })
        test("resetWizard reader ok navigates to WIZARD_STATE_UPLOAD", () => { })
        test("resetWizard reader not ok navigates to WIZARD_STATE_VERSION_CHECK_LOADING", () => { })
        afterEach(() => {
            eIDLinkController.controller = ORIGINAL_controller
            storeActions.resetStore = ORIGINAL_resetStore
            FlowIdActions.setNewFlowId = ORIGINAL_setNewFlowId
            navigation.navigateToStep = ORIGINAL_navigateToStep
        })
    })
})