import React from "react";
import {injectIntl} from "react-intl";
import { render, screen} from '../../testUtils/test-utils.js'
import {ResultContainer} from "./ResultContainer.js";

const ResultContainerWithIntl = injectIntl(ResultContainer)

describe("ResultContainer", () => {
    test("Has No signature message", () => {
        render(<ResultContainerWithIntl validation={{ diagnosticData: null  }} />);

        expect(screen.getByText('Result of the validation')).toBeInTheDocument();
        const noSign = screen.getByText('No signature could be found in the document.');
        expect(noSign).toBeInTheDocument();
        
        expect(noSign.getAttribute('role')).toBe('alert');
    })

    test("Has one bad signature", () => {
        render(<ResultContainerWithIntl validation=
            {{ diagnosticData: { 
                Signature: [ { Id: "S_1", ClaimedSigningTime: "Now", ChainItem: [ { Certificate: "C_1" } ]} ],
                Certificate: [ { Id: "C_1", CommonName: "Jeff Musk" } ]
             },
             report: '<report xmlns:ns1="http://dss.esig.europa.eu/validation/detailed-report">' +
                        '<ns1:Signature Id="S_2">' +
                            '<ns1:ValidationProcessBasicSignature/>' +
                            '<ns1:ValidationSignatureQualification/>' +
                        '</ns1:Signature>' +
                    '</report>'
        }} />);

        expect(screen.getByText('Result of the validation')).toBeInTheDocument();
        expect(screen.getByText('Jeff Musk')).toBeInTheDocument();
        expect(screen.getByText('Invalid date')).toBeInTheDocument();
        const NO = screen.getAllByText('No');
        expect(NO.length).toBe(2);
        expect(NO[0]).toBeInTheDocument();
        expect(NO[1]).toBeInTheDocument();
    })

    test("Has one OK signature", () => {
        render(<ResultContainerWithIntl validation=
            {{ diagnosticData: { 
                Signature: [ { Id: "S_1", ClaimedSigningTime: "Now", ChainItem: [ { Certificate: "C_1" } ]} ],
                Certificate: [ { Id: "C_1", CommonName: "Jeff Musk", KeyUsage: ['nonRepudiation'] } ]
             },
             report: '<report xmlns:ns1="http://dss.esig.europa.eu/validation/detailed-report">' +
                        '<ns1:Signature Id="S_1">' +
                            '<ns1:ValidationSignatureQualification SignatureQualification="QESig"/>' +
                            '<ns1:Conclusion>' +
                                '<ns1:Indication>TOTAL_PASSED</ns1:Indication>' +
                            '</ns1:Conclusion>' +
                        '</ns1:Signature>' +
                    '</report>' 
           }} />);

        expect(screen.getByText('Result of the validation')).toBeInTheDocument();
        expect(screen.getByText('Jeff Musk')).toBeInTheDocument();
        expect(screen.getByText('Invalid date')).toBeInTheDocument();
        const YES = screen.getAllByText('Yes');
        expect(YES.length).toBe(2);
        expect(YES[0]).toBeInTheDocument();
        expect(YES[1]).toBeInTheDocument();
    })

    test("Has two OK signature from the different certs", () => {
        render(<ResultContainerWithIntl validation=
            {{ diagnosticData: { 
                Signature: [ { Id: "S_1", ClaimedSigningTime: "Now", ChainItem: [ { Certificate: "C_2" } ]}, { Id: "S_2", ClaimedSigningTime: "NotNow", ChainItem: [ { Certificate: "C_1" } ]} ],
                Certificate: [ { Id: "C_1", CommonName: "Jeff Musk", KeyUsage: ['nonRepudiation'] }, { Id: "C_2", CommonName: "Elon Bezos", KeyUsage: ['nonRepudiation'] } ]
             },

             report: '<report xmlns:ns1="http://dss.esig.europa.eu/validation/detailed-report">' +
                        '<ns1:Signature Id="S_1">' +
                            '<ns1:ValidationSignatureQualification SignatureQualification="QESig"/>' +
                            '<ns1:Conclusion>' +
                                '<ns1:Indication>TOTAL_PASSED</ns1:Indication>' +
                            '</ns1:Conclusion>' +
                        '</ns1:Signature>' +
                        '<ns1:Signature Id="S_2">' +
                            '<ns1:ValidationSignatureQualification SignatureQualification="Invalid QESig"/>' +
                            '<ns1:Conclusion>' +
                                '<ns1:Indication>TOTAL_PASSED</ns1:Indication>' +
                            '</ns1:Conclusion>' +
                        '</ns1:Signature>' +
                    '</report>' 
            }} />);
        expect(screen.getByText('Result of the validation')).toBeInTheDocument();
        expect(screen.getAllByText('Jeff Musk').length).toBe(1);
        expect(screen.getAllByText('Elon Bezos').length).toBe(1);
        expect(screen.getAllByText('Invalid date').length).toBe(2);
        expect(screen.getAllByText('Yes').length).toBe(3);
        expect(screen.getAllByText('No').length).toBe(1);
    })

    test("Has one OK signature & one NOK signature from the same cert", () => {
        render(<ResultContainerWithIntl validation=
            {{ diagnosticData: { 
                Signature: [ { Id: "S_1", ClaimedSigningTime: "Now", ChainItem: [ { Certificate: "C_1" } ]}, { Id: "S_2", ClaimedSigningTime: "NotNow", ChainItem: [ { Certificate: "C_1" } ]} ],
                Certificate: [ { Id: "C_1", CommonName: "Jeff Musk", KeyUsage: ['nonRepudiation'] } ]
             },
             report: '<report xmlns:ns1="http://dss.esig.europa.eu/validation/detailed-report">' +
                        '<ns1:Signature Id="S_1">' +
                            '<ns1:ValidationSignatureQualification SignatureQualification="QESig"/>' +
                            '<ns1:Conclusion>' +
                                '<ns1:Indication>TOTAL_PASSED</ns1:Indication>' +
                            '</ns1:Conclusion>' +
                        '</ns1:Signature>' +
                        '<ns1:Signature Id="S_2">' +
                            '<ns1:ValidationSignatureQualification SignatureQualification="Invalid QESig"/>' +
                            '<ns1:Conclusion>' +
                                '<ns1:Indication>TOTAL_FAILED</ns1:Indication>' +
                                '<ns1:SubIndication>NO_CERTIFICATE_CHAIN_FOUND</ns1:SubIndication>' +
                            '</ns1:Conclusion>' +
                        '</ns1:Signature>' +
                    '</report>' 
            }} />);
        expect(screen.getByText('Result of the validation')).toBeInTheDocument();
        expect(screen.getAllByText('Jeff Musk').length).toBe(2);
        expect(screen.getAllByText('Invalid date').length).toBe(2);
        expect(screen.getAllByText('Yes').length).toBe(2);
        expect(screen.getAllByText('No').length).toBe(2);
    })

    test("Signature with 'PKCS7' ", () => {
        render(<ResultContainerWithIntl validation=
            {{ diagnosticData: { 
                Signature: [ { Id: "S_1", ClaimedSigningTime: "Now", ChainItem: [ { Certificate: "C_1" } ]} ],
                Certificate: [ { Id: "C_1", CommonName: "Jeff Musk", KeyUsage: ['nonRepudiation'] } ]
             },
             report: '<report xmlns:ns1="http://dss.esig.europa.eu/validation/detailed-report">' +
                        '<ns1:Signature Id="S_1">' +
                            '<ns1:Conclusion>' +
                                '<ns1:Indication>TOTAL_PASSED</ns1:Indication>' +
                            '</ns1:Conclusion>' +
                            '<ns1:ValidationProcessBasicSignature>' +
                                '<ns1:Conclusion>' +
                                    '<ns1:Errors Key="BBB_ICS_ISASCP_ANS">The signed attribute: \'signing-certificate\' is absent!</ns1:Errors>' +
                                '</ns1:Conclusion>' +
                            '</ns1:ValidationProcessBasicSignature>' +
                        '</ns1:Signature>' +
                    '</report>' 
           }} />);
        expect(screen.getByText('Result of the validation')).toBeInTheDocument();
        expect(screen.getAllByText('Jeff Musk').length).toBe(1);
        expect(screen.getAllByText('Invalid date').length).toBe(1);
        expect(screen.getAllByText('No').length).toBe(1);
        expect(screen.getAllByText('? *').length).toBe(1);
        expect(screen.getAllByText('Sign.belgium can\'t validate the signature based on the available information.').length).toBe(1);
    })
})
