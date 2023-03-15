import { render} from '../testUtils/test-utils.js'
import React from "react";
import {injectIntl} from "react-intl";
import { createMemoryHistory } from 'history';
import {Router} from "react-router-dom";
import {Footer} from "./Footer.js";
import {IntlProvider} from "react-intl";

const FooterWithIntl = injectIntl(Footer)

describe("Footer", () => {
    test("with Token", () => {

        const history = createMemoryHistory({ initialEntries: ['/'] });
        const { getByText } = render(
          <Router history={history}>
            <FooterWithIntl token="TOKEN"/>
          </Router>
        );

        expect(getByText(/Privacy Statement/i)).toBeInTheDocument();
        expect(getByText(/Cookie Policy/i)).toBeInTheDocument();
        expect(getByText(/version:.*TOKEN/i)).toBeInTheDocument();
    })

    test("without Token", () => {

        const history = createMemoryHistory({ initialEntries: ['/'] });
        const { getByText } = render(
          <Router history={history}>
            <FooterWithIntl locale="nl" />
          </Router>
        );

        expect(getByText(/General terms of use/i)).toBeInTheDocument();
        expect(getByText(/Privacy Statement/i)).toBeInTheDocument();
        expect(getByText(/Cookie Policy/i)).toBeInTheDocument();
        expect(getByText(/version:/i)).toBeInTheDocument();
    })


    test("without Token French", () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });
        const { getByText } = render(
          <Router history={history}>
            <IntlProvider locale="fr" messages={require('../../translations/fr.json')} >
                 <Footer />
           </IntlProvider>
          </Router>
        );

        expect(getByText(/Conditions générales d’utilisation/i)).toBeInTheDocument();
        expect(getByText(/Déclaration de confidentialité/i)).toBeInTheDocument();
        expect(getByText(/Politique relative aux cookie/i)).toBeInTheDocument();
        expect(getByText(/Déclaration d'accessibilité/i)).toBeInTheDocument();
        expect(getByText(/version:/i)).toBeInTheDocument();
    })
})