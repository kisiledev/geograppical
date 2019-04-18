import React, {Component} from 'react';
import Result from './Result';
import '../App.css';

class ResultList extends React.Component {
  
  render() {
    return(
      <div className="resultList col-8">
      {this.props.countries.map( country => 
        <Result 
        name={country.name}
        location = {country.location}
        type = {country.type}
        excerpt = {country.excerpt}
        number = {country.number}
        imgurl = {country.img.url}
        imgalt = {country.img.alt}        
        key={country.id.toString()}
        />
      )}
      </div>
    )
  }
}

export default ResultList;