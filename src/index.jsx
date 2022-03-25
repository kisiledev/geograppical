import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import toolkitStore from './redux-toolkit'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker';

render(
  <BrowserRouter>
    <Provider store={toolkitStore}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root'),
);

// if (module.hot) {
//   module.hot.accept();
// }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
