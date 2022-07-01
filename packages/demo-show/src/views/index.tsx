/** ESPOIR TEMPLATE */
import React from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';

import { PageAside, PageBody, PageContent, PageHeader } from './normal';
import Components from './components';


const App: React.FC = React.memo(() => (
  <React.Fragment>
    <PageHeader></PageHeader>
    <PageBody>
      <PageAside></PageAside>
      <PageContent>
        <Router>
          <Routes>
            <Route path="/" element={ <><Link to="/components">a</Link></> } />
            <Route path="/components/*" element={ <Components /> } />
          </Routes>
        </Router>
      </PageContent>
    </PageBody>
  </React.Fragment>
));

export default App;
