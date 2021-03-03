import {TokenWizardIntroComponent} from "./TokenWizardIntroContainer";
import { render} from '../../testUtils/test-utils.js'
import React from "react";

describe("TokenWizardIntroContainer", () => {
    test("shows start button & can click on it",  done => {
        const { getByText } = render(<TokenWizardIntroComponent navigateToNextStep={done}/>);
        const buttonElement = getByText(/Start/i);

        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement.id).toEqual("button_next");
        buttonElement.click();
    })
});