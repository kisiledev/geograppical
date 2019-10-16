/* eslint-disable no-mixed-operators */
import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import Breakpoint, { BreakpointProvider } from 'react-socks';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../App.css';
import Sidebar from './Sidebar';


const SideCountry = props => {
    const [sidebar, setSidebar] = useState('Show')

    const viewSidebar = () => {sidebar === "Show" ? setSidebar('Hide') : setSidebar('Show')}

    return (
        <BreakpointProvider>
        <nav className="sidebar card col-md-3">
            <Breakpoint small down>
                <button 
                className="btn btn-sm btn-block btn-outline-secondary mb-3" 
                onClick={()=> viewSidebar()}
                >
                { (sidebar === "Hide") ? "Show" : "Hide"} Countries List
                </button>
            {sidebar === "Show" ? 
            (props.loading ? <div className="mx-auto text-center"><FontAwesomeIcon icon={faSpinner} spin size="3x"/></div> : 
            <Sidebar {...props}/>): null}
            </Breakpoint>
        </nav>
        </BreakpointProvider>
    )
}

export default SideCountry;