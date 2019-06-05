import React, {Component} from 'react';


class NavBar extends Component {
    render(){
        return(
            <nav className="navbar navbar-expand-lg transparent navbar-inverse text-center">
                {/* <p className="navbar-brand" href="#">Geography</p> */}
                <form className="form-inline form-group d-inline justify-content-center mx-auto my-2 my-lg-0 w-100">
                        <input className="form-control form-control-lg search mr-sm-2" type="search" placeholder="Type to begin" aria-label="Search" value={this.props.searchText} onChange={this.props.passInput} />
                        <span className="badge badge-primary count">{this.props.filterNations.length}</span>
                </form>
            </nav>
        )
    }
}

export default NavBar;