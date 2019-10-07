/* eslint-disable no-mixed-operators */
import React, { useState } from 'react';
import { BreakpointProvider } from 'react-socks';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../App.css';
import Sidebar from './Sidebar.jsx';


const SideCountry = props => {
    const [sidebar, setSidebar] = useState('Show')

    const viewSidebar = () => {sidebar === "Show" ? setSidebar('Hide') : setSidebar('Show')}

    return (
        <BreakpointProvider>
        <nav className="countriesnav">
                <button 
                className="btn btn-sm btn-block btn-outline-secondary mb-3" 
                onClick={()=> viewSidebar()}
                >
                { (sidebar === "Hide") ? "Show" : "Hide"} Countries List
                </button>
            {sidebar === "Show" ? 
            (props.loading ? <div className="mx-auto text-center"><FontAwesomeIcon icon={faSpinner} spin size="3x"/></div> : 
            <Sidebar {...props}/>): null}
        </nav>
        </BreakpointProvider>
    )
}

export default SideCountry;