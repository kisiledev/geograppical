import React from 'react';
import { Link } from 'react-router-dom';


const NavBar = (props) => {
        return(
            <nav className="navbar navbar-expand-lg transparent navbar-inverse text-center">
                {/* <p className="navbar-brand">Geography</p> */}
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <Link to="/" className="nav-link" onClick={(e) => props.changeMode(e)}>Learn</Link>
                    </li>
                    <li className="nav-item"> 
                        <Link to="/play" className="nav-link" onClick={(e) => props.changeMode(e)}>Play</Link>
                    </li>
                    <li className="nav-item dropdown">
                        <Link to="#" className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Dropdown
                        </Link>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <Link to="#" className="dropdown-item">Action</Link>
                        <Link to="#" className="dropdown-item">Another action</Link>
                        <div className="dropdown-divider"></div>
                        <Link to="#" className="dropdown-item">Something else here</Link>
                        </div>
                    </li>
                    </ul>
                <form className="form-inline form-group d-inline justify-content-center mx-auto my-2 my-lg-0 w-100">
                        <input className="form-control form-control-lg search mr-sm-2" type="search" placeholder="Type to begin" aria-label="Search" value={props.searchText} onChange={props.handleInput} />
                        <span className="badge badge-primary count">{props.filterNations.length}</span>
                </form>
            </nav>
        )
    }

export default NavBar;