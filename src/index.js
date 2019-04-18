import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const props = {
    locale: {
        name: "Ghana", 
        location: "Afrika",
        type: "country",
        excerpt: "Ghana is a country in West Afrika, with a population of ... ",
        img: {
            url: "img/ghana.JPG",
            alt: "A view of Lake Volta"
        },
        number: 1
        },
    
}

ReactDOM.render(<App { ... props }  />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
