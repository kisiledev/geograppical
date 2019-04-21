import React, {Component} from 'react';
import '../App.css';

class Sidebar extends Component {
    render(){
        return (
            <div className="sidebar card col-sm-12 col-md-3">
                <ul>
                <li><strong>Countries:</strong> {this.props.countries.length} </li>
                {this.props.countries.map(country => 
                <li key={country.id}>{country.id}) {country.name}</li>
                )}
                </ul>
            </div>
        )
    }
}; 

export default Sidebar;