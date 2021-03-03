import { render} from '../../testUtils/test-utils.js'
import React from "react";
import {SuccesContainerForToken} from "./SuccesForTokenContainer";
import {injectIntl} from "react-intl";

const SuccesContainerForTokenWithIntl = injectIntl(SuccesContainerForToken)

describe("SuccesForTokenContainer", () => {
    test("Has Download document button", () => {
        const { getByText } = render(<SuccesContainerForTokenWithIntl />);
        expect(getByText(/Download document/i)).toBeInTheDocument();
    })
    test("Has next button & can click on it", done => {
        const { getByText } = render(<SuccesContainerForTokenWithIntl nextButtonClicked={done}/>);

        const buttonElement = getByText(/Close/i);
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement.id).toEqual("button_next");
        buttonElement.click();
    })
})