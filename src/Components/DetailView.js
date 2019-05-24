import React, {Component} from 'react';
import JSONTree from 'react-json-tree';
import axios from 'axios';
import '../App.css';
import Sidebar from './Sidebar';

class DetailView extends Component {
    render() {
        const totalRegions = this.props.geodata.map(a => a.region)
    function getOccurrence(array, value) {
      return array.filter((v) => (v === value)).length;
    }
    let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
    uniqueRegions = uniqueRegions.filter(Boolean);
      return(
        <div className="row">
            <div className="col-sm-12 col-md-8">
                <JSONTree data={this.props.countryDetail}/>
                <div className="card mb-3">
                    <h1>{this.props.countryDetail.name}</h1>
                    <h2>Geography</h2>
                    <p>{this.props.countryDetail.geography.location}</p>
                    <p>{this.props.countryDetail.geography.climate}</p>
                    <p>{this.props.countryDetail.geography.terrain}</p>
                    <p>{this.props.countryDetail.introduction.background}</p>
                    <p>{this.props.countryDetail.people.demographic_profile}</p>
                </div>
            </div>
            <Sidebar 
                geodata = {this.props.geodata}
                totalRegions = {totalRegions}
                uniqueRegions = {uniqueRegions}
                getOccurrence = {getOccurrence}
            />
        </div>
      )
    }
  }
  
  export default DetailView;