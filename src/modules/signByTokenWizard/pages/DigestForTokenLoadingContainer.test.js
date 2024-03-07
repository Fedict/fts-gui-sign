import { render} from '../../testUtils/test-utils.js'
import React from "react";
import {DigestForTokenLoadingContainer} from "./DigestForTokenLoadingContainer";
import {injectIntl} from "react-intl";
import {verifyCancelButton} from "../../testUtils/test-utils";

const DigestForTokenLoadingContainerWithIntl = injectIntl(DigestForTokenLoadingContainer)

describe("DigestForTokenLoadingContainer", () => {
    test("Calls load digest on mount", done => {
        const { getByText } = render(<DigestForTokenLoadingContainerWithIntl getDigestForToken={(locale) => done()}/>);
        expect(getByText(/Signing document/i)).toBeInTheDocument();
    })

    test("Has cancel button & can click on it", done => {
        const { getByText } = render(<DigestForTokenLoadingContainerWithIntl getDigestForToken={() => {}} resetWizard={done}/>);

        verifyCancelButton(getByText);
    })
})