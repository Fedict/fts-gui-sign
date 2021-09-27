import React from "react";
import {Provider} from "react-redux";
import TokenWizardContainer from "./TokenWizardContainer";
import configureStore from "../../store/store";
import {render, screen, wait} from "../testUtils/test-utils";
import {MemoryRouter, Route, Switch} from "react-router-dom";
import fetchMock from "fetch-mock";
import {EIDChromeExtMock} from "../testUtils/EIDChromeExtMock";
import {fireEvent} from "@testing-library/react";

describe('TokenWizardContainer', () => {
    let store;
    let ORIGINAL_window;
    beforeAll(() => {
        ORIGINAL_window = { ...window }

        window.confirm = () => (false);

        Object.defineProperty(window, "EIDChromeExt", ((value) => ({
            get() { return value; },
            set(v) { value = v; }
        }))(EIDChromeExtMock));

        jest.setTimeout(15 * 1000)
    })

    beforeEach(() => {
        store = configureStore();
        window.configData = { eIDLinkMinimumVersion: "1.0.0" }

    });

    test("sign for token flow", async (done) => {
        const token = '20201223121854';
        let lastLogMessage;
        fetchMock.mock(`/signing/getMetadataForToken?token=${token}`, {
            body: {
                "filename" : "This file is cool.pdf",
                "mimetype" : "application/pdf"
            },
            status: 200
        });
        fetchMock.post(`/validation/validateCertificates`, (url, req) => {
            console.log('REQ IS ', req)
            return {
                body: JSON.parse(req.body).length === 2?{
                    "indications" : [ {
                        "commonName" : "Joske Woske (Signature)",
                        "indication" : "PASSED",
                        "subIndication" : null,
                        "keyUsageCheckOk" : true
                    }, {
                        "commonName" : "Joske Woske (Authentication)",
                        "indication" : "PASSED",
                        "subIndication" : null,
                        "keyUsageCheckOk" : false
                    } ]
                }:{
                    "indications" : [ {
                        "commonName" : "Joske Woske (Signature)",
                        "indication" : "PASSED",
                        "subIndication" : null,
                        "keyUsageCheckOk" : true
                    } ]
                },
                status: 200
            }
        });
        fetchMock.post('/signing/getDataToSignForToken',{
            body: {
                "digestAlgorithm" : "SHA256",
                "digest" : "KxxqH7aC9Cx/xQiXfVk1OOlaCk+7mc2kXwlYl8kEqUs="
            },
            status: 200
        })
        fetchMock.post('/signing/signDocumentForToken', {
            "bytes" : "WVhCbWEyRXhaV0UyTXpWNllXTmhJRzloZWlCa2VqVmtNU0F6WVhvMUlERmtlZ29nTXpFPQ==",
            "digestAlgorithm" : null,
            "name" : "20201223121854-signed-pades-baseline-lta.pdf"
        })
        fetchMock.post('/logging/log', (url, opts) => {
            console.log('/logging/log', opts && opts.body?JSON.parse(opts.body).message:opts);
            if(opts && opts.body){
                lastLogMessage = JSON.parse(opts.body).message;
            }
        })

        render(<Provider store={store}>
            <MemoryRouter initialIndex={0} initialEntries={[`/sign/${token}`]}>
                <Switch>
                    <Route path="/sign/:token">
                        <TokenWizardContainer browserIsSupported={true} />
                    </Route>
                </Switch>
            </MemoryRouter>
        </Provider>)

        console.log("RENDERED")

        const documentReadCheckBox = await screen.findByTestId("documentReadCheckbox");

        expect(documentReadCheckBox).toBeInTheDocument();
        documentReadCheckBox.click();

        console.log("CHECKED")

        const startButton = await screen.findByRole('button', {name: /SIGN/i})

        expect(startButton).toBeEnabled();


        console.log("BEFORE CLICK START")
        startButton.click();
        //expect(screen.getByText(/Retrieving certificates/i)).toBeInTheDocument(); eid read in intro screen

        //expect(await screen.findByText(/Enter the PIN/i)).toBeInTheDocument();

        wait(() => (lastLogMessage.indexOf('WIZARD_STATE_PIN_INPUT') > -1), async () => {

            console.log("ENTER PIN")

            const inputCode = screen.getByTestId('input_code');

            for (let i = 1; i <= 4; i++) {
                fireEvent.keyDown(inputCode, {key: '1', code: 'NumPad1'});
                fireEvent.keyUp(inputCode, {key: '1', code: 'NumPad1'});
            }

            const signButton = screen.getByRole('button', {name: /Sign with eid/i})
            expect(signButton).toBeEnabled();
            signButton.click();

            console.log("SIGN BUTTON CLICKED")
            //console.log('TokenWC sign button clicked');

            expect(await screen.findByText(/Your document will be automatically downloaded./i)).toBeInTheDocument();
            done();
        }, 10)

    })


    test("sign for token flow don't auto download document", async (done) => {
        const token = '20201223121854';
        let lastLogMessage;
        fetchMock.mock(`/signing/getMetadataForToken?token=${token}`, {
            body: {
                "filename" : "This file is cool.pdf",
                "mimetype" : "application/pdf"
            },
            status: 200
        });
        fetchMock.post(`/validation/validateCertificates`, (url, req) => {
            console.log('REQ IS ', req)
            return {
                body: JSON.parse(req.body).length === 2?{
                    "indications" : [ {
                        "commonName" : "Joske Woske (Signature)",
                        "indication" : "PASSED",
                        "subIndication" : null,
                        "keyUsageCheckOk" : true
                    }, {
                        "commonName" : "Joske Woske (Authentication)",
                        "indication" : "PASSED",
                        "subIndication" : null,
                        "keyUsageCheckOk" : false
                    } ]
                }:{
                    "indications" : [ {
                        "commonName" : "Joske Woske (Signature)",
                        "indication" : "PASSED",
                        "subIndication" : null,
                        "keyUsageCheckOk" : true
                    } ]
                },
                status: 200
            }
        });
        fetchMock.post('/signing/getDataToSignForToken',{
            body: {
                "digestAlgorithm" : "SHA256",
                "digest" : "KxxqH7aC9Cx/xQiXfVk1OOlaCk+7mc2kXwlYl8kEqUs="
            },
            status: 200
        })
        fetchMock.post('/signing/signDocumentForToken', {
            "bytes" : "WVhCbWEyRXhaV0UyTXpWNllXTmhJRzloZWlCa2VqVmtNU0F6WVhvMUlERmtlZ29nTXpFPQ==",
            "digestAlgorithm" : null,
            "name" : "20201223121854-signed-pades-baseline-lta.pdf"
        })
        fetchMock.post('/logging/log', (url, opts) => {
            console.log('/logging/log', opts && opts.body?JSON.parse(opts.body).message:opts);
            if(opts && opts.body){
                lastLogMessage = JSON.parse(opts.body).message;
            }
        })

        render(<Provider store={store}>
            <MemoryRouter initialIndex={0} initialEntries={[`/sign/${token}`]}>
                <Switch>
                    <Route path="/sign/:token">
                        <TokenWizardContainer browserIsSupported={true} />
                    </Route>
                </Switch>
            </MemoryRouter>
        </Provider>)

        console.log("RENDERED")

        const documentReadCheckBox = await screen.findByTestId("documentReadCheckbox");

        expect(documentReadCheckBox).toBeInTheDocument();
        documentReadCheckBox.click();

        console.log("CHECKED")

        const startButton = await screen.findByRole('button', {name: /SIGN/i})

        expect(startButton).toBeEnabled();


        console.log("BEFORE CLICK START")
        startButton.click();
        //expect(screen.getByText(/Retrieving certificates/i)).toBeInTheDocument(); eid read in intro screen

        //expect(await screen.findByText(/Enter the PIN/i)).toBeInTheDocument();

        wait(() => (lastLogMessage.indexOf('WIZARD_STATE_PIN_INPUT') > -1), async () => {

            console.log("ENTER PIN")

            const downloadDocumentCB = screen.getByTestId('downloadDocument');

            expect(downloadDocumentCB).toBeChecked();

            downloadDocumentCB.click();

            const inputCode = screen.getByTestId('input_code');

            for (let i = 1; i <= 4; i++) {
                fireEvent.keyDown(inputCode, {key: '1', code: 'NumPad1'});
                fireEvent.keyUp(inputCode, {key: '1', code: 'NumPad1'});
            }

            const signButton = screen.getByRole('button', {name: /Sign with eid/i})
            expect(signButton).toBeEnabled();
            signButton.click();

            console.log("SIGN BUTTON CLICKED")
            //console.log('TokenWC sign button clicked');

            expect(await screen.findByText(/You can download the document by clicking on/i)).toBeInTheDocument();
            done();
        }, 10)

    })

    test("sign for token flow with two certificates", async (done) => {
        const token = '20201223121854';
        let lastLogMessage = '';
        fetchMock.mock(`/signing/getMetadataForToken?token=${token}`, {
            body: {
                "filename" : "This file is cool.pdf",
                "mimetype" : "application/pdf"
            },
            status: 200
        });
        fetchMock.post(`/validation/validateCertificates`, (url, req) => {
            return {
                body: JSON.parse(req.body).length === 2?{
                    "indications" : [ {
                        "commonName" : "Joske Woske (Signature)",
                        "indication" : "PASSED",
                        "subIndication" : null,
                        "keyUsageCheckOk" : true
                    }, {
                        "commonName" : "Joske Wiske (Authentication)",
                        "indication" : "PASSED",
                        "subIndication" : null,
                        "keyUsageCheckOk" : true
                    } ]
                }:{
                    "indications" : [ {
                        "commonName" : "Joske Woske (Signature)",
                        "indication" : "PASSED",
                        "subIndication" : null,
                        "keyUsageCheckOk" : true
                    } ]
                },
                status: 200
            }
        });
        fetchMock.post('/signing/getDataToSignForToken',{
            body: {
                "digestAlgorithm" : "SHA256",
                "digest" : "KxxqH7aC9Cx/xQiXfVk1OOlaCk+7mc2kXwlYl8kEqUs="
            },
            status: 200
        })
        fetchMock.post('/signing/signDocumentForToken', {
            "bytes" : "WVhCbWEyRXhaV0UyTXpWNllXTmhJRzloZWlCa2VqVmtNU0F6WVhvMUlERmtlZ29nTXpFPQ==",
            "digestAlgorithm" : null,
            "name" : "20201223121854-signed-pades-baseline-lta.pdf"
        })
        fetchMock.post('/logging/log', (url, opts) => {
            lastLogMessage = JSON.parse(opts.body).message;
        })
        render(<Provider store={store}>
            <MemoryRouter initialIndex={0} initialEntries={[`/sign/${token}`]}>
                <Switch>
                    <Route path="/sign/:token">
                        <TokenWizardContainer browserIsSupported={true} />
                    </Route>
                </Switch>
            </MemoryRouter>
        </Provider>)

        const documentReadCheckBox = await screen.findByTestId( "documentReadCheckbox");

        expect(documentReadCheckBox).toBeInTheDocument();
        documentReadCheckBox.click();

        const startButton = await screen.findByRole('button', {name: /SIGN/i})

        wait(() => {
            //there is a timeout in mock for reading the eID card
            expect(startButton).toBeEnabled();
        })

        startButton.click();

        //expect(screen.getByText(/Retrieving certificates/i)).toBeInTheDocument(); card is read in intro screen

        expect(await screen.findByText(/Select a certificate/i)).toBeInTheDocument();

        screen.getByText(/Joske Wiske/i).click();

        screen.getByRole('button', {name: /Select/i}).click();

        expect(await screen.findByText(/Download document after signing/i)).toBeInTheDocument();

        wait(() => (lastLogMessage.indexOf('WIZARD_STATE_PIN_INPUT') > -1), async () => {
            const inputCode = screen.getByTestId('input_code');

            for(let i = 1; i <= 4; i++){
                fireEvent.keyDown(inputCode, { key: '0', code: 'NumPad0' });
                fireEvent.keyUp(inputCode, { key: '0', code: 'NumPad0' });
            }

            const signButton = screen.getByRole('button', {name: /Sign with eid/i})
            expect(signButton).toBeEnabled();
            signButton.click();

            expect(await screen.findByText(/Your document will be automatically downloaded./i)).toBeInTheDocument();

            done();
        })

        //expect(lastLogMessage.indexOf('WIZARD_STATE_PIN_INPUT') > -1).toBeTruthy();

    })

    afterEach(() => {
        fetchMock.restore();
    });

    afterAll(() => {
        window = ORIGINAL_window;
    })
})