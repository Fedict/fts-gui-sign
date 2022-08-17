import {TokenDisplayFileList} from "./TokenDisplayFileList";
import { render, screen} from '../../../testUtils/test-utils.js'
import { signState } from '../../constants';
import React from "react";

describe("TokenDisplayFileList", () => {
    test("Displays a list of checkable files with preview",  done => {
        const setInputsSignState = jest.fn();
        const setPreviewFileId = jest.fn();
        const doSendLogInfo = jest.fn();

        const { container } = render(<TokenDisplayFileList selectedInputId={ 0 } doSendLogInfo={doSendLogInfo} setPreviewFileId={setPreviewFileId}
             setInputsSignState={setInputsSignState} tokenFile={ { previewDocuments: true, selectDocuments: true,
                inputs: [ {signState: signState.SIGN_REQUESTED, iconType: 'XML', cleanFileName: 'file1' }, {signState: signState.SIGN_REQUESTED, iconType: 'PDF', cleanFileName: 'fileB' } ] }} />);

        var elt = screen.getByText(/^UNSELECT ALL/);
        expect(elt).toBeInTheDocument();

        const fileDivs = container.getElementsByClassName('m-2 p-2 text-break');
        fileDivs[0].click();
        expect(setPreviewFileId).toBeCalled();

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
                inputs: [ {signState: signState.SIGN_REQUESTED, iconType: 'XML', cleanFileName: 'file1' }, {signState: signState.SIGN_REQUESTED, iconType: 'PDF', cleanFileName: 'fileB' } ] }} />);

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

