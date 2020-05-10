import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { App } from './modules/index';

import { CanvasBackend as Canvas, GitlabBackend as GL } from './api';

/**
 * Make sure to use your token for testing. Might want to use an .env file for this
 */
const GitLabAPI = new GL();
GitLabAPI.setToken(JSON.parse(localStorage.getItem('GTdata') || 'null') || '');
GitLabAPI.setHost(JSON.parse(localStorage.getItem('GHdata') || 'null') || 'https://gitlab.com');
export { GitLabAPI };

const CanvasAPI = new Canvas();
CanvasAPI.setToken(JSON.parse(localStorage.getItem('CTdata') || 'null') || '');
CanvasAPI.setUrl(JSON.parse(localStorage.getItem('CHdata') || 'null') || '');
export { CanvasAPI };

import BaseRepoStore from './stores/BaseRepoStore';
import CanvasStore from './stores/CanvasStore';
import RelationStore from './stores/RelationStore';

const load = async () => {
  ReactDOM.render(
    <div>
      <p>Please wait while the data loads...</p>
    </div>,
    document.getElementById('app')
  );
  const classes = await CanvasAPI.getClasses();

  BaseRepoStore.loadData(classes)
    .catch(console.error);
  await RelationStore.loadData(classes)
    .catch(console.error);

  ReactDOM.render(
    <Provider {...{BaseRepoStore, CanvasStore, RelationStore}}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>,
    document.getElementById('app')
  ); 
};

load()
  .catch(console.error);