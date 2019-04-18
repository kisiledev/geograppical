import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const countries = [
    {
        name: "Ghana", 
        location: "Afrika",
        type: "country",
        excerpt: "Ghana is a country in West Afrika, with a population of ... ",
        img: {
            url: "img/ghana.JPG",
            alt: "A view of Lake Volta"
        },
        id: 1
    },
    {
        name: "Burkina Faso", 
        location: "Afrika",
        type: "country",
        excerpt: "Burkino Faso is a country in West Afrika, with a population of ... ",
        img: {
            url: "img/bkfaso.jpg",
            alt: "Burkinabe children"
        },
        id: 2
    },
    {
        name: "Haiti", 
        location: "Caribbean Sea",
        type: "country",
        excerpt: "Haiti is an island country in the Caribbean Sea, with a population of ... ",
        img: {
            url: "img/haiti.jpg",
            alt: "Haitian beach"
        },
        id: 3
    }

]

ReactDOM.render(<App database = {countries}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
