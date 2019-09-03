import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { auth, provider } from './Firebase/firebase'
import { Redirect } from 'react-router-dom'
import * as ROUTES from '../Constants/Routes'


class NaviBar extends React.Component {

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
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link className="nav-link" href="/" onClick={(e) => this.props.changeMode(e)} >Learn</Nav.Link>
                    <Nav.Link className="nav-link" href="/play" onClick={(e) => this.props.changeMode(e)} >Play</Nav.Link>
                    </Nav>
                    <Nav>
                    <Nav.Link href="#deets">More deets</Nav.Link>
                    <Nav.Link eventKey={2} href="#memes">
                        Dank memes
                    </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                </Navbar>
            
        )
    }
}

export default NaviBar;