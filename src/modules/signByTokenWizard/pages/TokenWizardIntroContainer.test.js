import {TokenWizardIntroComponent} from "./TokenWizardIntroContainer";
import { render, screen} from '../../testUtils/test-utils.js'
import { signState } from '../constants';
import React from "react";

describe("TokenWizardIntroContainer", () => {
    test("shows start button & can click on it for a single file signature",  done => {
        const setInputsSignState = jest.fn();
        const setCustomSignature = jest.fn();
        const getCertificates = jest.fn();
        const doSendLogInfo = jest.fn();
        const setPreview = jest.fn();

        getCertificates.mockImplementation((callback) => {
            callback(true);
        });

        render(<TokenWizardIntroComponent navigateToNextStep={done} getCertificates={getCertificates} doSendLogInfo={doSendLogInfo} setPreview={setPreview} setCustomSignature={setCustomSignature}
             setInputsSignState={setInputsSignState} fileName={'aFile'} tokenFile={{ noSignedDownloads: true, inputs: [ {signState: signState.SIGN_REQUESTED} ] }} />);

        expect(screen.getByText(/^Please note:/)).toBeInTheDocument();

        expect(screen.getByText(/^Digital signature of 'aFile'/)).toBeInTheDocument();

        const buttonElement = screen.getByRole('button', {name : /SIGN/i});
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement.id).toEqual("button_next");

        expect(screen.queryByTestId( "documentReadCheckbox")).not.toBeInTheDocument();

        expect(getCertificates).toBeCalled();

        expect(buttonElement).toBeEnabled();
        buttonElement.click();
    })
});


describe("TokenWizardIntroContainer", () => {
    test("shows start button & can click on it, for multifile with read confirm",  done => {
        const setInputsSignState = jest.fn();
        const setCustomSignature = jest.fn();
        const getCertificates = jest.fn();
        const doSendLogInfo = jest.fn();
        const setPreviewFileId = jest.fn();
        const setPreview = jest.fn();
        

        getCertificates.mockImplementation((callback) => {
            callback(true);
        });

        render(<TokenWizardIntroComponent navigateToNextStep={done} getCertificates={getCertificates} doSendLogInfo={doSendLogInfo} setPreview={setPreview} setPreviewFileId={setPreviewFileId} setCustomSignature={setCustomSignature}
             setInputsSignState={setInputsSignState} isMultifile={true} tokenFile={{ requestDocumentReadConfirm: true, inputs: [ {signState: signState.SIGN_REQUESTED} , {signState: signState.SIGN_REQUESTED} ] }} />);

        expect(screen.getByText(/^Digitally sign multiple documents/)).toBeInTheDocument();
        expect(screen.getByText(/to digitally sign the documents/)).toBeInTheDocument();
        expect(screen.getByText(/sign these documents\?/)).toBeInTheDocument();

        const buttonElement = screen.getByRole('button', {name : /SIGN/i});
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement.id).toEqual("button_next");

        const documentReadCheckBox = screen.getByTestId( "documentReadCheckbox");
        expect(documentReadCheckBox).toBeInTheDocument();
        documentReadCheckBox.click();
        expect(doSendLogInfo).toBeCalled();

        expect(buttonElement).toBeEnabled();
        buttonElement.click();

        // Save last "customSignature" values to token's input field
        expect(setCustomSignature).toBeCalled();
        
        // Stop previewing documents
        expect(setPreview).toBeCalledWith(false);
        expect(setPreviewFileId).toBeCalledWith(-1);

        // Make all "SIGN_REQUESTED" documents into "TO_BE_SIGNED" documents
        expect(setInputsSignState).toBeCalledWith(signState.SIGN_REQUESTED, signState.TO_BE_SIGNED);
    })
});







