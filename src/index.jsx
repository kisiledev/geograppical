import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import theme from './Helpers/Theme';
import App from './App';
import toolkitStore from './redux-toolkit';
import * as serviceWorker from './serviceWorker';

render(
  <BrowserRouter>
    <Provider store={toolkitStore}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

// if (module.hot) {
//   module.hot.accept();
// }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
