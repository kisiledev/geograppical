import React from 'react';
import '../App.css';

const Sidebar =(props) => {
        if(props.regionData[0] === undefined){
            return (
                <nav className="sidebar card col-md-3">
                    <div className="sidebar-sticky">
                        <h5 className="text-center" onClick={props.sideBar}><strong>Countries:</strong> {props.geodata.length} </h5>
                        <ul className="nav nav-pills flex-column">
                        <h5>Waiting for Data</h5>
                        </ul>
                    </div>
                </nav>
            )
        }
        let lis = [];
        for (let i = 0; i < props.uniqueRegions.length -1; i++) {
        lis.push(
            <li className="nav-item" key={i}>
            <span className="nav-link bg-success mb-1"><strong>{props.uniqueRegions[i]}</strong> - {props.getOccurrence(props.totalRegions, props.uniqueRegions[i])}</span>
            <ul>
                {props.regionData.map((country, index) => <li key={index}>{country.name}</li>) || null}
            </ul>
            </li>

        )};
        return (
            <nav className="sidebar card col-md-3">
                <div className="sidebar-sticky">
                    <h5 className="text-center" onClick={props.sideBar}><strong>Countries:</strong> {props.geodata.length} </h5>
                    <ul className="nav nav-pills flex-column">
                        {props.lis}
                    </ul>
                </div>
            </nav>
        )
    }

export default Sidebar;