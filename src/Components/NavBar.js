import React from 'react';
import { Link } from 'react-router-dom';


const NavBar = (props) => {
        return(
            <nav className="navbar navbar-expand-lg transparent navbar-inverse text-center">
                {/* <p className="navbar-brand">Geography</p> */}
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/" className="nav-link" onClick={(e) => props.changeMode(e)}>Learn</Link>
                    </li>
                    <li className="nav-item"> 
                        <Link to="/play" className="nav-link" onClick={(e) => props.changeMode(e)}>Play</Link>
                    </li>
                    </ul>
                <form className="form-inline form-group d-inline justify-content-center mx-auto my-2 my-lg-0 w-100">
                        <input className="form-control form-control-lg search mr-sm-2" type="search" placeholder="Type to begin" aria-label="Search" value={props.searchText} onChange={(e) => props.handleInput(e)} />
                        {/* <span className="badge badge-primary count">{props.filterNations.length}</span> */}
                </form>
            </nav>
        )
    }

export default NavBar;