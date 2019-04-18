import React, { Component } from 'react';
import Search from './Components/Search';
import logo from './logo.svg';
import './App.css';

function App(props) {
  return (
    <div className="main container card">
      <h1>Geography Search App</h1>
      <Search />
      <div className="row">
      <div className="resultList card col-8">
        <div className="result media">
          <div className="media-body">
            <h4 className="title">
              {props.locale.name}
            </h4>
            <p className="excerpt">
            {props.locale.excerpt}
            </p>
          </div>  
          <img className="ml-3" src={props.locale.img.url} alt={props.locale.img.alt}/>

        </div>
      </div>
      <div className="sidebar card col-3 ml-5">
        <ul>
          <li>Countries: {props.locale.number}</li>
        </ul>
      </div>
      </div>
    </div>
  )
}

export default App;
