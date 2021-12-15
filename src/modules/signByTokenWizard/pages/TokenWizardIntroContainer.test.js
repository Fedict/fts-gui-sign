import {TokenWizardIntroComponent} from "./TokenWizardIntroContainer";
import { render, screen} from '../../testUtils/test-utils.js'
import React from "react";

describe("TokenWizardIntroContainer", () => {
    test("shows start button & can click on it",  done => {
        const getCertificates = jest.fn();
        const doSendLogInfo = jest.fn();

        getCertificates.mockImplementation((callback) => {
            callback(true);
        });

        render(<TokenWizardIntroComponent navigateToNextStep={done} getCertificates={getCertificates} doSendLogInfo={doSendLogInfo}/>);

        const buttonElement = screen.getByRole('button', {name : /SIGN/i});

        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement.id).toEqual("button_next");
        //expect(buttonElement).toBeDisabled();

        expect(getCertificates).toBeCalled();

        // const documentReadCheckBox = screen.getByTestId( "documentReadCheckbox");

        // expect(documentReadCheckBox).toBeInTheDocument();
        // documentReadCheckBox.click();
        // expect(doSendLogInfo).toBeCalled();

        expect(buttonElement).toBeEnabled();
        buttonElement.click();
    })
});