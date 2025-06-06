import React from "react"
import { useIntl } from 'react-intl';
import Navbar from './modules/Navbar/Navbar';
import WizardContainer from './modules/signWizard/WizardContainer';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ValidateWizardContainer from './modules/validateWizard/ValidateWizardContainer';
import MessageContainer from './modules/message/MessageContainer';
import { ErrorNotSupported, ErrorIE11NotSupported } from './modules/message/MessageConstants';
import Footer from './modules/footer/Footer';
import { GeneralTerms, PrivacyStatement, CookiePolicy, InternalFAQ } from './modules/info/InformationPages';
import StartPageContainer from './modules/startPage/StartPageContainer';
import MainI18nWrapper from "./modules/i18n/MainI18nWrapper";
import TokenWizardContainer from "./modules/signByTokenWizard/TokenWizardContainer";
import { isInIframe } from "./modules/utils/helper";
import { getBrowserInfo, browser } from './modules/browserDetection/BrowserDetection';
import { Helmet } from "react-helmet-async";

const BaseApp = () => {
    const bi = getBrowserInfo();
    return (
        <div lang={ useIntl().locale } >
            {isInIframe() ? false : <Navbar />}
            {bi.accepted ?
                (<div className="container-fluid" style={{ marginBottom: '64px' }} >
                    <Switch>
                        <Route path="/sign/:token"><TokenWizardContainer /></Route>
                        <Route path="/sign" exact strict><WizardContainer /></Route>
                        <Route path="/validate"><ValidateWizardContainer /></Route>
                        <Route path="/pkcs7"><InternalFAQ /></Route>
                        <Route path="/gtou"><GeneralTerms /></Route>
                        <Route path="/ps"><PrivacyStatement /></Route>
                        <Route path="/cookies"><CookiePolicy /></Route>
                        <Route path="/"><StartPageContainer /></Route>
                    </Switch>
                </div>)
                : (bi.browser === browser.IE
                    ? (
                        <div className="container">
                            <div className="col col-12 col-md-8 mx-auto align-middle">
                                <MessageContainer message={ErrorIE11NotSupported} />
                            </div>
                        </div>)
                : (
                    <div className="container">
                        <div className="col col-12 col-md-8 mx-auto align-middle">
                            <MessageContainer message={ErrorNotSupported} />
                        </div>
                    </div>
                )
                )
            }
            <Footer/>
        </div>
    )
}
const App = () => {
    return (
        <Router>
            <Helmet>
                <meta httpEquiv="Content-Security-Policy" content={ window.configData.CSP }></meta>
            </Helmet>
            <MainI18nWrapper>
                <BaseApp/>
            </MainI18nWrapper>
        </Router>
    );
}

export default App;