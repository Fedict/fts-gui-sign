import React from 'react';

import Navbar from './modules/Navbar/Navbar';
import WizardContainer from './modules/signWizard/WizardContainer';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import ValidateWizardContainer from './modules/validateWizard/ValidateWizardContainer';

function App() {
  return (
    <Router>
      <div >
        <Navbar />
        <Switch>
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
            <p>here the homePage</p>
          </Route>

        </Switch>

      </div>
    </Router>
  );
}

export default App;
