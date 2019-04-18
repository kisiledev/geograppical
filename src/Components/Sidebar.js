import React from 'react';
import '../App.css';

const Sidebar = (props) => (
    <div className="sidebar card col-3 ml-5">
        <ul>
          <li>Countries: {props.countries.length} </li>
        </ul>
      </div>
)

export default Sidebar;