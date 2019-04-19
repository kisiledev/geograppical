import React, {Component} from 'react';
import '../App.css';

class Sidebar extends Component {
    render(){
        return (
            <div className="sidebar card col-3 ml-5">
                <ul>
                <li>Countries: {this.props.countries.length} </li>
                <li>Continents: {this.props.countries.filter((location) => {
                    return location.location === "Afrika"
                }).length}</li>
                </ul>
            </div>
        )
    }
}; 

export default Sidebar;