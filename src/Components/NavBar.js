import React, {Component} from 'react';
import { Link } from 'react-router-dom';


class NavBar extends Component {
    render(){
        return(
            <nav className="navbar navbar-expand-lg transparent navbar-inverse text-center">
                {/* <p className="navbar-brand">Geography</p> */}
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <Link className="nav-link" onClick={(e) => this.props.changeMode(e)}>Learn</Link>
                    </li>
                    <li className="nav-item"> 
                        <Link className="nav-link" onClick={(e) => this.props.changeMode(e)}>Play</Link>
                    </li>
                    <li className="nav-item dropdown">
                        <Link className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Dropdown
                        </Link>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <Link className="dropdown-item">Action</Link>
                        <Link className="dropdown-item">Another action</Link>
                        <div className="dropdown-divider"></div>
                        <Link className="dropdown-item">Something else here</Link>
                        </div>
                    </li>
                    </ul>
                <form className="form-inline form-group d-inline justify-content-center mx-auto my-2 my-lg-0 w-100">
                        <input className="form-control form-control-lg search mr-sm-2" type="search" placeholder="Type to begin" aria-label="Search" value={this.props.searchText} onChange={this.props.handleInput} />
                        <span className="badge badge-primary count">{this.props.filterNations.length}</span>
                </form>
            </nav>
        )
    }
}

export default NavBar;