import React from 'react';
import '../App.css';

const Result = (props) => (
    <div className="card mb-3">
    <div className="result media">
        <div className="media-body">
        <h4 className="title">
            {props.name}
        </h4>
        <p className="excerpt">
        {props.excerpt}
        </p>
        </div>  
        <img className="ml-3" src={props.imgurl} alt={props.imgalt}/>

    </div>
    </div>
);

export default Result;