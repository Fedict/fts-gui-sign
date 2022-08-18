import { render, screen} from '../../testUtils/test-utils.js'
import React from "react";
import {SuccesContainerForToken} from "./SuccesForTokenContainer";
import {injectIntl} from "react-intl";
import { signState } from '../constants';
import {getByRole} from "@testing-library/dom";

const SuccesContainerForTokenWithIntl = injectIntl(SuccesContainerForToken)

describe("SuccesForTokenContainer", () => {
    test("Has Download document button", () => {
        render(<SuccesContainerForTokenWithIntl multipleDocuments={true} autoDownloadDocument={true} tokenFile={{ noSignedDownloads: false, inputs: [ { signState: signState.SIGNED }, { signState: signState } ] }} />);

        expect(screen.getByRole('button', {name : /Download document/i})).toBeInTheDocument();

        expect(screen.getByText('Your documents have been successfully signed!')).toBeInTheDocument();
        expect(screen.getByText(/The signed version of your documents will be automatically/)).toBeInTheDocument();
    })
})


describe("SuccesForTokenContainer", () => {
    test("Single document", () => {
        render(<SuccesContainerForTokenWithIntl multipleDocuments={false} autoDownloadDocument={false} tokenFile={{ noSignedDownloads: true, inputs: [ { signState: signState.SIGNED } ] }} />);

        expect(screen.queryByRole('button', {name : /Download document/i})).not.toBeInTheDocument();

        expect(screen.getByText('Your document has been successfully signed!')).toBeInTheDocument();
    })
})