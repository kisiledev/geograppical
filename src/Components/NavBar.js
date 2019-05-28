import React, {Component} from 'react';


class NavBar extends Component {
    render(){
        return(
            <nav className="navbar navbar-expand-lg transparent navbar-inverse text-center">
                {/* <p className="navbar-brand" href="#">Geography</p> */}
                <form className="form-inline d-inline justify-content-center mx-auto my-2 my-lg-0 w-100">
                        <input className="form-control form-control-lg search mr-sm-2" type="search" placeholder="Type to begin" aria-label="Search" value={this.props.searchText} onChange={this.props.passInput} />
                </form>
            </nav>
        )
    }
}

export default NavBar;