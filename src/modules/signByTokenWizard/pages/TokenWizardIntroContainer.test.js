import {TokenWizardIntroComponent} from "./TokenWizardIntroContainer";
import { render, screen} from '../../testUtils/test-utils.js'
import { signState } from '../constants';
import React from "react";

describe("TokenWizardIntroContainer", () => {
    test("shows start button & can click on it for a single file signature",  done => {
        const setInputsSignState = jest.fn();
        const getCertificates = jest.fn();
        const doSendLogInfo = jest.fn();
        const setPreview = jest.fn();

        getCertificates.mockImplementation((callback) => {
            callback(true);
        });

        render(<TokenWizardIntroComponent navigateToNextStep={done} getCertificates={getCertificates} doSendLogInfo={doSendLogInfo} setPreview={setPreview}
             setInputsSignState={setInputsSignState} fileName={'aFile'} tokenFile={{ noSignedDownloads: true, inputs: [ {signState: signState.SIGN_REQUESTED} ] }} />);

        const downloadTextElement = screen.getByText(/^Please note:/);
        expect(downloadTextElement).toBeInTheDocument();

        const signOneFileElement = screen.getByText(/^Digital signature of 'aFile'/);
        expect(signOneFileElement).toBeInTheDocument();

        const buttonElement = screen.getByRole('button', {name : /SIGN/i});

        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement.id).toEqual("button_next");

        expect(getCertificates).toBeCalled();

        expect(buttonElement).toBeEnabled();
        buttonElement.click();
    })
});


describe("TokenWizardIntroContainer", () => {
    test("shows start button & can click on it, for multifile with read confirm",  done => {
        const setInputsSignState = jest.fn();
        const getCertificates = jest.fn();
        const doSendLogInfo = jest.fn();
        const setPreviewFileId = jest.fn();
        const setPreview = jest.fn();

        getCertificates.mockImplementation((callback) => {
            callback(true);
        });

        render(<TokenWizardIntroComponent navigateToNextStep={done} getCertificates={getCertificates} doSendLogInfo={doSendLogInfo} setPreview={setPreview} setPreviewFileId={setPreviewFileId}
             setInputsSignState={setInputsSignState} isMultifile={true} tokenFile={{ requestDocumentReadConfirm: true, inputs: [ {signState: signState.SIGN_REQUESTED} , {signState: signState.SIGN_REQUESTED} ] }} />);

        var elt = screen.getByText(/^Digitally sign multiple documents/);
        expect(elt).toBeInTheDocument();

        elt = screen.getByText(/to digitally sign the documents/);
        expect(elt).toBeInTheDocument();

        elt = screen.getByText(/sign these documents\?/);
        expect(elt).toBeInTheDocument();

        const buttonElement = screen.getByRole('button', {name : /SIGN/i});
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement.id).toEqual("button_next");

        const documentReadCheckBox = screen.getByTestId( "documentReadCheckbox");
        expect(documentReadCheckBox).toBeInTheDocument();
        documentReadCheckBox.click();
        expect(doSendLogInfo).toBeCalled();

        expect(buttonElement).toBeEnabled();
        buttonElement.click();
    })
});







