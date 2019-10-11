import React from 'react';
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap';
import { auth, googleProvider } from './Firebase/firebase'
import { withRouter } from 'react-router-dom'
import * as ROUTES from '../Constants/Routes'


const NaviBar = props => {
    const login = () => {
        auth.signInWithPopup(googleProvider)
        .then((result) => {
            const user = result.user;
            console.log(user)
        }).catch((error) => {
            console.log(error)
            console.log(error.message)
        })
    }
    const logout = () => {
        auth.signOut()
        props.history.push('/')
    }
        return(
            <Navbar collapseOnSelect expand="lg" bg="info" variant="dark">
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Form 
                    className="ml-auto searchForm" 
                    inline
                    onSubmit={(e) => props.getResults(props.searchText, e)}
                    >
                    <FormControl 
                        type="text" 
                        placeholder="Search" 
                        className="search mr-sm-2"
                        value={props.searchText}
                        onChange={(e) => props.handleInput(e)} 
                    />
                </Form>
                <Navbar.Collapse className="justify-content-end text-center" id="responsive-navbar-nav">
                    <Nav.Link href={ROUTES.ACCOUNT} className="nav-item-avatar">
                    <img className="nav-avatar" src={props.user ? (props.user.photoURL ? props.user.photoURL : require('../img/user.png')) : require('../img/user.png')} alt="avatar" />
                    </Nav.Link>
                    {props.user ? null : 
                    <Nav>
                        <Nav.Link className="navbarlink" href={ROUTES.SIGN_UP}>Sign Up</Nav.Link>
                        <Nav.Link className="navbarlink" href={ROUTES.SIGN_IN}>Sign In</Nav.Link>
                    </Nav>
                    }
                    {props.user ? 
                    <button onClick={logout} className="btn btn-warning my-2">Log Out</button>
                    :
                    <button onClick={login} type="button" className="ml-2 google-button">
                        <span className="google-button__icon">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="emailicon" alt="google icon" />
                        </span>
                        <span className="google-button__text">Sign in</span>
                    </button>
                    }
                </Navbar.Collapse>
            </Navbar>
            
        )
}

export default withRouter(NaviBar);