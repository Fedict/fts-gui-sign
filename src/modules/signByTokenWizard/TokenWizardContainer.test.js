import React from "react";
import {Provider} from "react-redux";
import TokenWizardContainer from "./TokenWizardContainer";
import configureStore from "../../store/store";
import {render, screen} from "../testUtils/test-utils";
import {MemoryRouter, Route, Switch} from "react-router-dom";
import {sleep} from "../utils/helper";
import fetchMock from "fetch-mock";
import {EIDChromeExtMock} from "../testUtils/EIDChromeExtMock";
import {fireEvent} from "@testing-library/react";

describe('TokenWizardContainer', () => {
    let store;
    let ORIGINAL_window;
    beforeAll(() => {
        ORIGINAL_window = { ...window }
    })

    beforeEach(() => {
        store = configureStore();
        window.configData = { eIDLinkMinimumVersion: "1.0.0" }

        Object.defineProperty(window, "EIDChromeExt", ((value) => ({
            get() { return value; },
            set(v) { value = v; }
        }))(EIDChromeExtMock));

    });

    test("sign for token flow", async () => {
        const token = '20201223121854';
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

        render(<Provider store={store}>
            <MemoryRouter initialIndex={0} initialEntries={[`/sign/${token}`]}>
                <Switch>
                    <Route path="/sign/:token">
                        <TokenWizardContainer browserIsSupported={true} />
                    </Route>
                </Switch>
            </MemoryRouter>
        </Provider>)

        //expect(screen.getByLabelText(/Retrieving Metadata/i)).toBeInTheDocument();


        const startButton = await screen.findByRole('button', {name: /Start/i})

        startButton.click();


        expect(screen.getByText(/Retrieving certificates/i)).toBeInTheDocument();

        expect(await screen.findByText(/Enter pin code/i)).toBeInTheDocument();
        const inputCode = screen.getByTestId('input_code');

        for(let i = 1; i <= 4; i++){
            fireEvent.keyDown(inputCode, { key: 'A', code: 'KeyA' });
            fireEvent.keyUp(inputCode, { key: 'A', code: 'KeyA' });
        }

//        userEvent.type(screen.getByTestId(('input_code')), '1234')

        const signButton = screen.getByRole('button', {name: /Sign with eid/i})
        expect(signButton).toBeEnabled();
        signButton.click();

        expect(await screen.findByText(/Your document has been successfully signed!/i)).toBeInTheDocument();

    })

    afterEach(() => {
        fetchMock.restore();
    });

    afterAll(() => {
        window = ORIGINAL_window
    })
})