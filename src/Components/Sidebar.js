import React, {Component} from 'react';
import '../App.css';

class Sidebar extends Component {
    render(){
        return (
            <div className="sidebar card col-sm-12 col-md-4">
                <ul>
                <li><strong>Countries:</strong> {this.props.geodata.length} </li>
                </ul>
            </div>
        )
    }
}; 

export default Sidebar;