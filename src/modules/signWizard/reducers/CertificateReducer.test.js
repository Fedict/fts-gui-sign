import CertificateReducer, { initialState } from "./CertificateReducer"
import { CERTIFICATE_SAVE_LIST, CERTIFICATE_SELECT_CERTIFICATE } from "../actions/CertificateActions"
import { STORE_RESET } from "../../../store/storeActions"

describe("CertificateReducer", () => {

    describe("reducer", () => {

        describe("CERTIFICATE_SAVE_LIST", () => {

            test("action with type CERTIFICATE_SAVE_LIST changes certificateList object", () => {
                const startState = { ...initialState }
                const action = {
                    type: CERTIFICATE_SAVE_LIST, payload: [{
                        readerName: 'reader',
                        readerType: 'standard',
                        cardType: 'BEID',
                        certificate: 'cert',
                        APIBody: {
                            certificate: {
                                encodedCertificate: 'cert'
                            }
                        },
                        indication: 'PASSED',
                        keyUsageCheckOk: true,
                        commonName: 'Laura De Groof (Signature)'
                    }]
                }
                const result = CertificateReducer(startState, action)

                expect(result.certificateList).toEqual(action.payload)
                expect(result).toEqual({ ...initialState, certificateList: action.payload, neverSaved: false })
            })
        })

        describe("CERTIFICATE_SELECT_CERTIFICATE", () => {

            test("action with type CERTIFICATE_SELECT_CERTIFICATE changes certificateSelected object", () => {
                const startState = { ...initialState }
                const action = {
                    type: CERTIFICATE_SELECT_CERTIFICATE, payload: {
                        readerName: 'reader',
                        readerType: 'standard',
                        cardType: 'BEID',
                        certificate: 'cert',
                        APIBody: {
                            certificate: {
                                encodedCertificate: 'cert'
                            },
                            certificateChain: [
                                {
                                    encodedCertificate: 'cert'
                                },
                                {
                                    encodedCertificate: 'cert'
                                }
                            ]
                        },
                        indication: 'PASSED',
                        keyUsageCheckOk: true,
                        commonName: '(Signature)'
                    }
                }
                const result = CertificateReducer(startState, action)

                expect(result.certificateSelected).toEqual(action.payload)
                expect(result).toEqual({ ...initialState, certificateSelected: action.payload })
            })
        })

        describe("STORE_RESET", () => {

            test("action with type STORE_RESET resets store to initial value", () => {
                const startState = {
                    certificate: {
                        certificateList: [
                            {
                                readerName: 'reader',
                                readerType: 'standard',
                                cardType: 'BEID',
                                certificate: 'cert',
                                APIBody: {
                                    certificate: {
                                        encodedCertificate: 'cert'
                                    }
                                },
                                indication: 'PASSED',
                                keyUsageCheckOk: true,
                                commonName: 'name (Signature)'
                            }
                        ],
                        certificateSelected: {
                            readerName: 'reader',
                            readerType: 'standard',
                            cardType: 'BEID',
                            certificate: 'cert',
                            APIBody: {
                                certificate: {
                                    encodedCertificate: 'cert'
                                },
                                certificateChain: [
                                    {
                                        encodedCertificate: 'cert'
                                    },
                                    {
                                        encodedCertificate: 'cert'
                                    }
                                ]
                            },
                            indication: 'PASSED',
                            keyUsageCheckOk: true,
                            commonName: 'name (Signature)'
                        }
                    }
                }
                const action = { type: STORE_RESET }
                const result = CertificateReducer(startState, action)

                expect(result).toEqual({ ...initialState })
            })
        })
    })
})