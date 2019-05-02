/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';
import Axios from 'axios';
import '../App.css';

class Sidebar extends Component {

    state = {};

    componentDidMount(){
        this.filterRegion();
    }

    filterRegion = (region) =>{
        if(region !==undefined)
          return Axios
           .get('https://restcountries.eu/rest/v2/region/' + region)
           .then(res => {
             if(res.status === 200 && res !== null){
              this.setState(prevState =>({
                [region]: res && res.data || [] 
              }))
              } else {
               throw new Error('No country found');
             }
             })
             .catch(error => {
               console.log(error)
               return []
             });
         };

    render(){
        const handleRegion =(string) =>{
            const regionCountries = this.filterRegion(string);
            console.log(regionCountries);
            
        }
            return (
                <nav className="sidebar card col-md-3">
                    <div className="sidebar-sticky">
                        <h5 className="text-center">
                            <strong>Countries:</strong> 
                            {this.props.geodata.length} 
                        </h5>
                        <ul className="nav nav-pills flex-column">
                        {this.props.uniqueRegions.map( (region, index ) => 
                            <li className="nav-item" key={index} onClick={() => handleRegion(region)} >
                                <span className="nav-link bg-success mb-1">
                                    <strong>{region}</strong> - {this.props.getOccurrence(this.props.totalRegions, region)}
                                </span>
                                <ul>
                                {this.state[region] && this.state[region].map((country, index) => 
                                    <li key={index} className="nav-item">
                                        <span className="nav-link bg-info mb-1">{country.name}</span>
                                    </li>
                                )}
                                </ul>
                            </li>
                            )}
                        </ul>
                    </div>
                </nav>
            )
        }
}

export default Sidebar;