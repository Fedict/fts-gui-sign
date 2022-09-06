import React from "react";
import {injectIntl} from "react-intl";
import { render, screen} from '../../testUtils/test-utils.js'
import {ResultContainer} from "./ResultContainer.js";

const ResultContainerWithIntl = injectIntl(ResultContainer)

describe("ResultContainer", () => {
    test("Has No signature message", () => {
        render(<ResultContainerWithIntl validation={{ diagnosticData: null  }} />);

        expect(screen.getByText('Result of the validation')).toBeInTheDocument();
        expect(screen.getByText('No signature could be found in the document.')).toBeInTheDocument();
    })
})

describe("ResultContainer", () => {
    test("Has one bad signature", () => {
        render(<ResultContainerWithIntl validation=
            {{ diagnosticData: { 
                Signature: [ { Id: "S_1", ClaimedSigningTime: "Now", ChainItem: [ { Certificate: "C_1" } ]} ],
                Certificate: [ { Id: "C_1", CommonName: "Jeff Musk" } ]
             },
            report: '<report><ValidationCertificateQualification></ValidationCertificateQualification><ValidationProcessBasicSignature></ValidationProcessBasicSignature></report>'
        }} />);

        expect(screen.getByText('Result of the validation')).toBeInTheDocument();
        expect(screen.getByText('Jeff Musk')).toBeInTheDocument();
        expect(screen.getByText('Invalid date')).toBeInTheDocument();
        const NO = screen.getAllByText('No');
        expect(NO.length).toBe(2);
        expect(NO[0]).toBeInTheDocument();
        expect(NO[1]).toBeInTheDocument();
    })
})

describe("ResultContainer", () => {
    test("Has one OK signature", () => {
        render(<ResultContainerWithIntl validation=
            {{ diagnosticData: { 
                Signature: [ { Id: "S_1", ClaimedSigningTime: "Now", ChainItem: [ { Certificate: "C_1" } ]} ],
                Certificate: [ { Id: "C_1", CommonName: "Jeff Musk", KeyUsage: ['nonRepudiation'] } ]
             },
            report: '<report xmlns:ns1="http://dss.esig.europa.eu/validation/detailed-report"><ns1:parent SignatureQualification="QESig"><ns1:ValidationCertificateQualification Id="C_1"></ns1:ValidationCertificateQualification></ns1:parent><ns1:parent Id="S_1"><ns1:ValidationProcessBasicSignature><ns1:Conclusion><ns1:Indication>PASSED</ns1:Indication></ns1:Conclusion></ns1:ValidationProcessBasicSignature></ns1:parent></report>'
        }} />);

        expect(screen.getByText('Result of the validation')).toBeInTheDocument();
        expect(screen.getByText('Jeff Musk')).toBeInTheDocument();
        expect(screen.getByText('Invalid date')).toBeInTheDocument();
        const YES = screen.getAllByText('Yes');
        expect(YES.length).toBe(2);
        expect(YES[0]).toBeInTheDocument();
        expect(YES[1]).toBeInTheDocument();
    })
})
