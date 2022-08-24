import { render} from '../../testUtils/test-utils.js'
import React from "react";
import {SuccesContainerForToken} from "./SuccesForTokenContainer";
import {injectIntl} from "react-intl";
import {getByRole} from "@testing-library/dom";

const SuccesContainerForTokenWithIntl = injectIntl(SuccesContainerForToken)

describe("SuccesForTokenContainer", () => {
    test("Has Download document button", () => {
        const { getByRole } = render(<SuccesContainerForTokenWithIntl tokenFile={{ noSignedDownload: true, clientNames: {} }} />);

        expect(getByRole('button', {name : /Download document/i})).toBeInTheDocument();
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