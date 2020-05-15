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
import { MessageContainer } from './modules/message/MessageContainer';
import { ErrorNotSupported } from './modules/message/MessageConstants';

function App() {
  const browserIsSupported = browserIsAccepted()
  const notSupportedMessage = ErrorNotSupported;
  return (
    <Router>
      <div >
        <Navbar />
        {(browserIsSupported) ?
          (<Switch>
            <Route path="/sign">
              <div className="container-fluid">
                <WizardContainer />
              </div>
            </Route>
            <Route path="/validate">
              <div className="container">
                <ValidateWizardContainer />
              </div>
            </Route>
            <Route path="/">

              <WizardContainer />
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

      </div>
    </Router>
  );
}

export default App;
