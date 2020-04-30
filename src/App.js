import React from 'react';

import  Navbar  from './modules/Navbar/Navbar';
import WizardContainer from './modules/signWizard/WizardContainer';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <Route path="/sign">
            <div className="container">
              <WizardContainer />
            </div>
          </Route>
          <Route path="/validate">
            <p>here the validate wizard</p>
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
