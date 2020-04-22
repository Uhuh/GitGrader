import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { App } from './modules/index';

import BaseRepoStore from './stores/BaseRepoStore';
import CanvasStore from './stores/CanvasStore';

BaseRepoStore.loadData()
  .catch(console.error);

ReactDOM.render(
  <Provider {...{BaseRepoStore, CanvasStore}}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('app')
); 
