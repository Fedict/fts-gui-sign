import * as navigation from "../../wizard/WizardActions"
import { navigateToStep } from "../../wizard/WizardActions"
import { navigateToSign } from "./WizardLogicActions"
import { WIZARD_STATE_PIN_INPUT, WIZARD_STATE_SIGNING_PRESIGN_LOADING } from "../../wizard/WizardConstants"


const ORIGINAL_navigateToStep = navigateToStep

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
        test("createCertificateObject creates correct object", () => { })
        test("createCertificateObject creates correct object without certificate", () => { })
        test("createCertificateObject creates correct object without certificete chain", () => { })
        test("createCertificateObject creates correct object without rootCA", () => { })
        test("createCertificateObject creates correct object without subCA", () => { })
        test("createCertificateObject creates correct object with 1 subCA", () => { })
        test("createCertificateObject creates correct object with multiple subCA", () => { })
        test("createCertificateObject creates correct object without certificate objects", () => { })

    })

    describe("getCertificatesFromResponse", () => {
        test("getCertificatesFromResponse creates correct object without response", () => { })
        test("getCertificatesFromResponse creates correct object without response.Readers", () => { })
        test("getCertificatesFromResponse creates correct object with response.Readers is empty array", () => { })
        test("getCertificatesFromResponse creates correct object with response.Readers with 1 item without certificate array", () => { })
        test("getCertificatesFromResponse creates correct object with response.Readers with 1 item with 1 certificate", () => { })
        test("getCertificatesFromResponse creates correct object with response.Readers with 1 item with multiple certificates", () => { })
    })

    describe("handleFlowIdError", () => {
        test("handleFlowIdError returns response if flowID in the store is the same as the flowID in att", () => { })
        test("handleFlowIdError throws error if flowID in the store is not the same as the flowID in att", () => { })
    })

    describe("createRequestId", () => {
        test("createRequestId return a new request ID", () => { })
        test("createRequestId creates a setTimeout with correct interval", () => { })
        test("createRequestId timeOut stops eIDLink and checks version when requestID is in Store and ", () => { })
        test("createRequestId timeOut does when requestID is not in Store and ", () => { })
    })

    describe("handleRequestIdError", () => {
        test("handleRequestIdError removes requestId from store", () => { })
        test("handleRequestIdError returns response when requestId is in the store", () => { })
        test("handleRequestIdError throws error when requestId in not is in the store", () => { })
    })

    describe("createGetVersionRequestId", () => {
        test('createGetVersionRequestId returns a new request ID', () => { })
        test('createGetVersionRequestId creates a setTimeout of 4000ms', () => { })
        test('createGetVersionRequestId setTimeout reloads page when requestId is in store', () => { })
        test('createGetVersionRequestId setTimeout does nothing when requestId in not in store', () => { })
    })

    describe("checkVersion", () => {
        test("checkVersion calls the checkversion of eIDLink", () => { })
        test("checkVersion creates a requestId", () => { })
        test("checkVersion uses correct minimum version", () => { })
        test("checkVersion navigates to FileUpload if version is correct and isErrorCheck is false", () => { })
        test("checkVersion navigates to default error if version is correct and isErrorCheck is true", () => { })
        test("checkVersion navigates to default error if version is correct and isErrorCheck is true", () => { })
        test("checkVersion navigates to eIDLink install if eIDLink native host is not active", () => { })
        test("checkVersion navigates to eIDLink update if eIDLink native host is outdated", () => { })
        test("checkVersion navigates to eIDLink extention install if eIDLink Extention is not found", () => { })
    })

    describe("getCertificates", () => {
        test("getCertificates calls getCertificate of eIDLink", () => { })
        test("checkVersion creates a requestId", () => { })
        test("checkVersion succes saves respons in store", () => { })
        test("checkVersion succes certificateList.length = 0 shows a MessageCertificatesNotFound error", () => { })
        test("checkVersion succes certificateList.length > 0 navigates to certificate validation page", () => { })
        test("checkVersion error INCORECT_REQUEST_ID does nothing", () => { })
        test("checkVersion error INCORECT_FLOW_ID does nothing", () => { })
    })

    describe("validateCertificates", () => { })
})