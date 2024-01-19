import {TokenDisplayFileList} from "./TokenDisplayFileList";
import { render, screen} from '../../../testUtils/test-utils.js'
import { signState } from '../../constants';
import React from "react";

describe("TokenDisplayFileList", () => {
    test("Displays a list of checkable files with preview",  done => {
        const setInputsSignState = jest.fn();
        const setCustomSignature = jest.fn();
        const setSignAttributes = jest.fn();
        const setPreviewFileId = jest.fn();
        const doSendLogInfo = jest.fn();

        const { container } = render(<TokenDisplayFileList selectedInputId={ 0 } doSendLogInfo={doSendLogInfo} setPreviewFileId={setPreviewFileId} setCustomSignature={setCustomSignature} setSignAttributes={setSignAttributes}
             setInputsSignState={setInputsSignState} tokenFile={ { previewDocuments: true, selectDocuments: true,
                inputs: [ {signState: signState.SIGN_REQUESTED, mimeType: 'application/xml', fileName: 'file1.xml' }, {signState: signState.SIGN_REQUESTED, mimeType: 'application/pdf', fileName: 'fileB.pdf' } ] }} />);

        var elt = screen.getByText(/^UNSELECT ALL/);
        expect(elt).toBeInTheDocument();

        const fileDivs = container.getElementsByClassName('m-2 p-2 text-break');
        fileDivs[0].click();
        expect(setPreviewFileId).toBeCalled();
        expect(setSignAttributes).toBeCalled();
        expect(setCustomSignature).toBeCalled();

        var checkBoxes = screen.getAllByRole('checkbox');
        expect(checkBoxes.length).toBe(2)
        
        checkBoxes[0].click();
        expect(setInputsSignState).toBeCalled();
        expect(doSendLogInfo).toBeCalled();
        
        done();
    })
});

describe("TokenDisplayFileList", () => {
    test("Displays a list of files no-preview no-selection",  done => {
        const setPreviewFileId = jest.fn();
        const doSendLogInfo = jest.fn();

        render(<TokenDisplayFileList selectedInputId={ 0 } doSendLogInfo={doSendLogInfo} setPreviewFileId={setPreviewFileId}
             setInputsSignState={done} tokenFile={ { previewDocuments: false, selectDocuments: false,
                inputs: [ {signState: signState.SIGN_REQUESTED, mimeType: 'application/xml', fileName: 'file1.xml' }, {signState: signState.SIGN_REQUESTED, mimeType: 'application/pdf', fileName: 'fileB.pdf' } ] }} />);

        var elt = screen.getByText(/^file1/);
        expect(elt).toBeInTheDocument();

        elt = screen.getByText(/^fileB/);
        expect(elt).toBeInTheDocument();

        var icons = screen.getAllByRole('img');
        expect(icons.length).toBe(2)
        expect(icons[0].src).toBe('http://localhost/img/IconXML.png')
        expect(icons[1].src).toBe('http://localhost/img/IconPDF.png')

        done();
    })
});

