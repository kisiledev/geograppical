import React from 'react';
import Result from './Result';
import '../App.css';

const ResultList = (props) => (
    <div className="resultList col-8">
      {props.countries.map( country => 
        <Result 
        name={country.name}
        location = {country.location}
        type = {country.type}
        excerpt = {country.excerpt}
        number = {country.number}
        imgurl = {country.img.url}
        imgalt = {country.img.alt}        
        />
      )}
      </div>
);

export default ResultList;