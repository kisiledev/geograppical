import React from 'react';
import { Link } from 'react-router-dom';
import { auth, provider } from './Firebase/firebase'
import { Redirect } from 'react-router-dom'

class NavBar extends React.Component {

    login = () => {
        auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            console.log(user)
        }).catch((error) => {
            console.log(error)
            console.log(error.message)
        })
    }
    logout = () => {
        auth.signOut()
        return <Redirect to="/" />    
    }
    render(){
        return(
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark flex-row navbar-inverse text-center">
                {/* <p className="navbar-brand">Geography</p> */}
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/" className="nav-link" onClick={(e) => this.props.changeMode(e)}>Learn</Link>
                    </li>
                    <li className="nav-item"> 
                        <Link to="/play" className="nav-link" onClick={(e) => this.props.changeMode(e)}>Play</Link>
                    </li>
                    </ul>
                <form className="form-inline form-group d-inline justify-content-center mx-auto my-2 my-lg-0">
                        <input className="form-control form-control-lg search mr-sm-2" type="search" placeholder="Type to search" aria-label="Search" value={this.props.searchText} onChange={(e) => this.props.handleInput(e)} />
                        {/* <span className="badge badge-primary count">{props.filterNations.length}</span> */}
                </form>
                <ul className="navbar-nav">
                    <li className="nav-item nav-item-avatar">
                        
                    <Link to="/account" className="nav-link d-flex align-items-center">
                    <img className="nav-avatar" src={this.props.user ? (this.props.user.photoURL ? this.props.user.photoURL : require('../img/user.png')) : require('../img/user.png')} alt="avatar"/>{this.props.user ? this.props.user.displayName : null }</Link>
                    </li>
                </ul>
                {this.props.user ? 
                <button onClick={this.logout} className="btn btn-warning">Log Out</button>
                :
                <button onClick={this.login} className="btn btn-warning">Log In</button>
                }
            </nav>
        )
    }
}

export default NavBar;