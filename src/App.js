import React from 'react';
import Navbar from './modules/Navbar/Navbar';
import WizardContainer from './modules/signWizard/WizardContainer';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import ValidateWizardContainer from './modules/validateWizard/ValidateWizardContainer';
import { browserIsAccepted } from './modules/browserDetection/BrowserDetection';
import MessageContainer from './modules/message/MessageContainer';
import { ErrorNotSupported } from './modules/message/MessageConstants';
import Footer from './modules/footer/Footer';
import StartPageContainer from './modules/startPage/StartPageContainer';
import MainI18nWrapper from "./modules/i18n/MainI18nWrapper";
import TokenWizardContainer from "./modules/signByTokenWizard/TokenWizardContainer";
import {isInIframe} from "./modules/utils/helper";

export const BaseApp = ({browserIsSupported, notSupportedMessage}) => (
    <div >
        {isInIframe()?false:<Navbar />}
        {(browserIsSupported) ?
            (<Switch>
                <Route path="/sign/:token">
                    <div className="container-fluid">
                        <TokenWizardContainer />
                    </div>
                </Route>
                <Route path="/sign" exact strict>
                    <div className="container-fluid">
                        <WizardContainer />
                    </div>
                </Route>
                <Route path="/validate">
                    <div className="container-fluid">
                        <ValidateWizardContainer />
                    </div>
                </Route>
                <Route path="/">
                    <div className="container-fluid">   
                        <StartPageContainer />
                    </div>
                </Route>

            </Switch>)
            : (
                <div className="container">
                    <div className="col col-12 col-md-8 mx-auto align-middle">
                        <MessageContainer message={notSupportedMessage} />
                    </div>
                </div>
            )
        }
        <Footer />
    </div>
)

function App() {
  const browserIsSupported = browserIsAccepted()
  const notSupportedMessage = ErrorNotSupported;
  return (
      <Router>
          <MainI18nWrapper>
              <BaseApp browserIsSupported={browserIsSupported} notSupportedMessage={notSupportedMessage}/>
          </MainI18nWrapper>
      </Router>
  );
}

export default App;