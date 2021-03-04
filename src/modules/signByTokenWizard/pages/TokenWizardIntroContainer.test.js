import {TokenWizardIntroComponent} from "./TokenWizardIntroContainer";
import { render, screen} from '../../testUtils/test-utils.js'
import React from "react";

describe("TokenWizardIntroContainer", () => {
    test("shows start button & can click on it",  done => {
        render(<TokenWizardIntroComponent navigateToNextStep={done}/>);
        const buttonElement = screen.getByRole('button', {name : /Start/i});

        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement.id).toEqual("button_next");
        buttonElement.click();
    })
});