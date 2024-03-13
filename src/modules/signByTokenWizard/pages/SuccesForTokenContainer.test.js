import { render, screen} from '../../testUtils/test-utils.js'
import React from "react";
import {SuccesContainerForToken} from "./SuccesForTokenContainer";
import {injectIntl} from "react-intl";
import { signState } from '../constants';
import {getByRole} from "@testing-library/dom";

const SuccesContainerForTokenWithIntl = injectIntl(SuccesContainerForToken)

describe("SuccesForTokenContainer", () => {
    test("Has Download document button", () => {
        render(<SuccesContainerForTokenWithIntl multipleDocuments={true} autoDownloadDocument={true} tokenFile={{ noSignedDownloads: false, clientNames: {}, inputs: [ { signState: signState.SIGNED }, { signState: signState } ] }} />);

        expect(screen.getByRole('button', {name : /Download document/i})).toBeInTheDocument();

        expect(screen.getByText('Your documents have been successfully signed!')).toBeInTheDocument();
        expect(screen.getByText(/The signed version of your documents will be automatically/)).toBeInTheDocument();
    })

    test("Single document", () => {
        render(<SuccesContainerForTokenWithIntl autoDownloadDocument={false} tokenFile={{ noSignedDownloads: true, clientNames: { }, inputs: [ { signState: signState.SIGNED } ] }} />);

        expect(screen.queryByRole('button', {name : /Download document/i})).not.toBeInTheDocument();

        expect(screen.getByText('Your document has been successfully signed!')).toBeInTheDocument();
    })

    test("Default client name", () => {
        const { getByText } = render(<SuccesContainerForTokenWithIntl tokenFile={{ noSignedDownload: true, inputs: [{ signState: signState.SIGNED }], clientNames: { name: "Howdy" }  }} />);

        expect(getByText(/You'll be redirected to Howdy in 3 seconds/)).toBeInTheDocument();
    })

    test("no Download left", () => {
        const { getByText } = render(<SuccesContainerForTokenWithIntl tokenFile={{ noSignedDownload: true, inputs: [], clientNames: { name_en: "Yo!" }  }} />);

        expect(getByText(/Due to an error, the file cannot be signed and downloaded. Please try again./)).toBeInTheDocument();
    })
})