import { render} from '../../testUtils/test-utils.js'
import React from "react";
import {SuccesContainerForToken} from "./SuccesForTokenContainer";
import {injectIntl} from "react-intl";
import {getByRole} from "@testing-library/dom";

const SuccesContainerForTokenWithIntl = injectIntl(SuccesContainerForToken)

describe("SuccesForTokenContainer", () => {
    test("Has Download document button", () => {
        const { getByRole } = render(<SuccesContainerForTokenWithIntl />);

        expect(getByRole('button', {name : /Download document/i})).toBeInTheDocument();
    })
})