import React from 'react';

import { Navbar } from './modules/components/Navbar/Navbar';
import WizardContainer from './modules/wizard/wizard/WizardContainer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <WizardContainer />
      </div>
    </div>
  );
}

export default App;
