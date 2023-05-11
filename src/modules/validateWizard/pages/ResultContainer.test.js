import React from "react";
import {injectIntl} from "react-intl";
import { render, screen} from '../../testUtils/test-utils.js'
import {ResultContainer} from "./ResultContainer.js";

const ResultContainerWithIntl = injectIntl(ResultContainer)

describe("ResultContainer", () => {
    test("Has No signature message", () => {
        render(<ResultContainerWithIntl report= { '<report />' } normalizedReport = {{ signatures: [] }}
    />);

        expect(screen.getByText('Result of the validation')).toBeInTheDocument();
        const noSign = screen.getByText('No signature could be found in the document.');
        expect(noSign).toBeInTheDocument();
        
        expect(noSign.getAttribute('role')).toBe('alert');
    })

    test("Has one bad signature", () => {
        render(<ResultContainerWithIntl report= { '<report />' } normalizedReport = {{ signatures: [ {
            valid: false,
            qualified: false,
            missingSigningCert: false,
            signerCommonName: "Jeff Musk",
            claimedSigningTime: null,
            signatureFormat: "PKCS7_LT"
        } ] }}
    />);

        expect(screen.getByText('Result of the validation')).toBeInTheDocument();
        expect(screen.getByText('Jeff Musk')).toBeInTheDocument();
        expect(screen.getByText('Invalid date')).toBeInTheDocument();
        const NO = screen.getAllByText('No');
        expect(NO.length).toBe(2);
        expect(NO[0]).toBeInTheDocument();
        expect(NO[1]).toBeInTheDocument();
        expect(screen.queryAllByText('EU').length).toBe(0);
        expect(screen.queryAllByText('Non-EU').length).toBe(0);
    })

    test("Has one OK signature", () => {
        render(<ResultContainerWithIntl report= { '<report />' } normalizedReport = {{ signatures: [ {
            valid: true,
            qualified: true,
            missingSigningCert: false,
            signerCommonName: "Jeff Musk",
            claimedSigningTime: null,
            signatureFormat: "PKCS7"
        } ] }}
    />);

        expect(screen.getByText('Result of the validation')).toBeInTheDocument();
        expect(screen.getByText('Jeff Musk')).toBeInTheDocument();
        expect(screen.getByText('Invalid date')).toBeInTheDocument();
        const YES = screen.getAllByText('Yes');
        expect(YES.length).toBe(2);
        expect(YES[0]).toBeInTheDocument();
        expect(YES[1]).toBeInTheDocument();
        expect(screen.getAllByText('Non-EU').length).toBe(1);
    })

    test("Has two OK signature from the different certs", () => {
        render(<ResultContainerWithIntl report= { '<report />' } normalizedReport = {{ signatures: [ {
                valid: true,
                qualified: true,
                missingSigningCert: false,
                signerCommonName: "Jeff Musk",
                claimedSigningTime: null,
                signatureFormat: "PDAES_"
            },
            {
                valid: true,
                qualified: false,
                missingSigningCert: false,
                signerCommonName: "Elon Bezos",
                claimedSigningTime: null,
                signatureFormat: "ANYTHING_REALLY"
            } ] }}
        />);
        expect(screen.getByText('Result of the validation')).toBeInTheDocument();
        expect(screen.getAllByText('Jeff Musk').length).toBe(1);
        expect(screen.getAllByText('Elon Bezos').length).toBe(1);
        expect(screen.getAllByText('Invalid date').length).toBe(2);
        expect(screen.getAllByText('Yes').length).toBe(3);
        expect(screen.getAllByText('No').length).toBe(1);
        expect(screen.getAllByText('EU').length).toBe(2);
    })

    test("Has one OK signature & one NOK signature from the same cert", () => {
        render(<ResultContainerWithIntl report= { '<report />' } normalizedReport = {{ signatures: [ {
                valid: true,
                qualified: true,
                missingSigningCert: false,
                signerCommonName: "Jeff Musk",
                claimedSigningTime: null,
                signatureFormat: "CADES_"
            },
            {
                valid: false,
                qualified: false,
                missingSigningCert: false,
                signerCommonName: "Jeff Musk",
                claimedSigningTime: null,
                signatureFormat: "XADES"
            } ] }}
        />);
        expect(screen.getByText('Result of the validation')).toBeInTheDocument();
        expect(screen.getAllByText('Jeff Musk').length).toBe(2);
        expect(screen.getAllByText('Invalid date').length).toBe(2);
        expect(screen.getAllByText('Yes').length).toBe(2);
        expect(screen.getAllByText('No').length).toBe(2);
        expect(screen.getAllByText('EU').length).toBe(1);
    })

    test("Signature with 'PKCS7' ", () => {
        render(<ResultContainerWithIntl report= { '<report />' } normalizedReport = {{ signatures: [ {
                        valid: true,
                        qualified: false,
                        missingSigningCert: true,
                        signerCommonName: "Jeff Musk",
                        claimedSigningTime: null,
                        signatureFormat: "PKCS7_LT"
                    } ] }}
                />);
        expect(screen.getByText('Result of the validation')).toBeInTheDocument();
        expect(screen.getAllByText('Jeff Musk').length).toBe(1);
        expect(screen.getAllByText('Invalid date').length).toBe(1);
        expect(screen.getAllByText('No').length).toBe(1);
        expect(screen.getAllByText('? *').length).toBe(1);
        expect(screen.getAllByText('Sign.belgium can\'t validate the signature based on the available information.').length).toBe(1);
    })
})
