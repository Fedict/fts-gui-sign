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
})


describe("SuccesForTokenContainer", () => {
    test("Single document", () => {
        render(<SuccesContainerForTokenWithIntl multipleDocuments={false} autoDownloadDocument={false} tokenFile={{ noSignedDownloads: true, clientNames: { }, inputs: [ { signState: signState.SIGNED } ] }} />);

        expect(screen.queryByRole('button', {name : /Download document/i})).not.toBeInTheDocument();

        expect(screen.getByText('Your document has been successfully signed!')).toBeInTheDocument();
    })
})

describe("SuccesForTokenContainer", () => {
    test("Default client name", () => {
        const { getByText } = render(<SuccesContainerForTokenWithIntl tokenFile={{ noSignedDownload: true, clientNames: { name: "Howdy" }  }} />);

        expect(getByText(/You'll be redirected to Howdy in 3 seconds/)).toBeInTheDocument();
    })
})

describe("SuccesForTokenContainer", () => {
    test("en client name", () => {
        const { getByText } = render(<SuccesContainerForTokenWithIntl tokenFile={{ noSignedDownload: true, clientNames: { name_en: "Yo!" }  }} />);

        expect(getByText(/You'll be redirected to Yo! in 3 second/)).toBeInTheDocument();
    })
})