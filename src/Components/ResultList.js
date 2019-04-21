import React, {Component} from 'react';
import Result from './Result';
import '../App.css';

class ResultList extends Component {
  render() {
    return(
      <div className="col-sm-12 col-md-8 mb-3">
      
      {this.props.countries.map( country => 
        <Result 
        name={country.name}
        location = {country.location}
        type = {country.type}
        excerpt = {country.excerpt}
        number = {country.number}
        imgurl = {country.imgurl}
        imgalt = {country.imgalt}        
        key={country.id.toString()}
        />
      )}
      </div>
    )
  }
}

export default ResultList;