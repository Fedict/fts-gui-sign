import * as navigation from "../../wizard/WizardActions"
import { navigateToStep } from "../../wizard/WizardActions"
import { navigateToSign, createCertificateObject, getCertificatesFromResponse } from "./WizardLogicActions"
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
        test("checkVersion error shows message", () => { })
        test("checkVersion error INCORECT_REQUEST_ID does nothing", () => { })
        test("checkVersion error INCORECT_FLOW_ID does nothing", () => { })
    })

    describe("validateCertificates", () => {
        test("validateCertificates calls validateCertificatesAPI with the correct body ", () => { })
        test("validateCertificates doesn't call validateCertificatesAPI if there are no certificates ", () => { })
        test("validateCertificates succes saves only valid certificates ", () => { })
        test("validateCertificates succes valid certificates list.length == 0 shows error MessageCertificatesNotFound ", () => { })
        test("validateCertificates succes valid certificates list.length == 1 selects certificate and navigates to WIZARD_STATE_CERTIFICATES_VALIDATE_CHAIN ", () => { })
        test("validateCertificates succes valid certificates list.length > 1 navigates to WIZARD_STATE_CERTIFICATES_CHOOSE ", () => { })
        test("validateCertificates error shows message", () => { })
        test("validateCertificates error INCORECT_FLOW_ID does nothing", () => { })
    })

    describe("validateCertificateChain", () => {
        test("validateCertificateChain doesn't call eIDLink getCertificateChain if there is no selectedCertificate", () => { })
        test("validateCertificateChain calls getCertificateChain", () => { })
        test("validateCertificateChain creates a requestId of 10000ms", () => { })
        test("validateCertificateChain succes calls handleFlowIdError", () => { })
        test("validateCertificateChain succes calls handleRequestIdError", () => { })
        test("validateCertificateChain succes calls validateCertificate with certificate chain", () => { })
        test("validateCertificateChain error shows message", () => { })
        test("validateCertificateChain error INCORECT_REQUEST_ID does nothing", () => { })
        test("validateCertificateChain error INCORECT_FLOW_ID does nothing", () => { })
    })

    describe("validateCertificate", () => {
        test("validateCertificates calls validateCertificatesAPI with the correct body ", () => { })
        test("validateCertificates succes saves only valid certificates ", () => { })
        test("validateCertificates succes certificate valid selects certificate and navigates to WIZARD_STATE_DIGEST_LOADING ", () => { })
        test("validateCertificates succes certificate not valid shows MessageCertificatesNotFound", () => { })
        test("validateCertificates error shows MessageCertificatesNotFound", () => { })
        test("validateCertificates error INCORECT_FLOW_ID does nothing", () => { })
    })

    describe("getDigest", () => {
        test("getDigest doesn't call getDataToSignAPI when no selected certificate", () => { })
        test("getDigest calls getDataToSignAPI", () => { })
        test("getDigest succes calls handleFlowIdError", () => { })
        test("getDigest succes sets digist in store", () => { })
        test("getDigest succes navigates to sign", () => { })
        test("getDigest error shows message", () => { })
        test("getDigest error INCORECT_FLOW_ID does nothing", () => { })
    })

    describe("navigateToSign", () => {
        test("navigateToSign shows ErrorGeneral if no certificateSelected", () => { })
        test("navigateToSign pinpad reader navigates to WIZARD_STATE_SIGNING_PRESIGN_LOADING and calls sign(null)", () => { })
        test("navigateToSign no pinpad reader navigates to WIZARD_STATE_PIN_INPUT", () => { })
    })

    describe("navigateToPinError", () => {
        test("navigateToPinError shows ErrorGeneral if no certificateSelected", () => { })
        test("navigateToPinError pinpad navigates to WIZARD_STATE_PINPAD_ERROR", () => { })
        test("navigateToPinError no pinpad navigates to WIZARD_STATE_PIN_INPUT", () => { })
    })

    describe("sign", () => {
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
    })

    describe("signDocument", () => {
        test("signDocument shows ErrorGeneral when not all data is present", () => { })
        test("signDocument navigates to WIZARD_STATE_SIGNING_LOADING", () => { })
        test("signDocument calls signDocumentAPI", () => { })
        test("signDocument succes handleFlowIdError", () => { })
        test("signDocument succes setDownloadFile", () => { })
        test("signDocument succes navigates to WIZARD_STATE_SUCCES", () => { })
        test("signDocument succes shows ErrorGeneral when not all data is present ", () => { })
        test("signDocument error shows message", () => { })
        test("signDocument error INCORECT_FLOW_ID does nothing", () => { })
    })

    describe("resetWizard", () => {
        test("resetWizard resetStore and creates new flowId", () => { })
        test("resetWizard reader ok navigates to WIZARD_STATE_UPLOAD", () => { })
        test("resetWizard reader not ok navigates to WIZARD_STATE_VERSION_CHECK_LOADING", () => { })
    })
})