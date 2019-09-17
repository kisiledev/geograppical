import React from 'react';
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap';
import { auth, googleProvider } from './Firebase/firebase'
import { Redirect, withRouter } from 'react-router-dom'
import * as ROUTES from '../Constants/Routes'


class NaviBar extends React.Component {
    componentDidMount = ()=> {
        console.log(this.props)
    }
    login = () => {
        auth.signInWithPopup(googleProvider)
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
                <Form 
                    className="ml-auto searchForm" 
                    inline
                    onSubmit={(e) => this.props.getResults(this.props.searchText, e)}
                    >
                    <FormControl 
                        type="text" 
                        placeholder="Search" 
                        className="search mr-sm-2"
                        value={this.props.searchText}
                        onChange={(e) => this.props.handleInput(e)} 
                    />
                </Form>
                <Nav>
                    <Nav.Link href={ROUTES.ACCOUNT} className="nav-item-avatar">
                    <img className="nav-avatar" src={this.props.user ? (this.props.user.photoURL ? this.props.user.photoURL : require('../img/user.png')) : require('../img/user.png')} alt="avatar" />
                    </Nav.Link>
                </Nav>
                <Navbar.Collapse className="text-center" id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link className="navbarlink" href="/" onClick={(e) => this.props.changeMode(e)} >Learn</Nav.Link>
                    <Nav.Link className="navbarlink" href="/play" onClick={(e) => this.props.changeMode(e)} >Play</Nav.Link>
                    </Nav>
                    {this.props.user ? null : 
                    <Nav>
                        <Nav.Link className="navbarlink" href={ROUTES.SIGN_UP}>Sign Up</Nav.Link>
                        <Nav.Link className="navbarlink" href={ROUTES.SIGN_IN}>Sign In</Nav.Link>
                    </Nav>
                    }
                    {this.props.user ? 
                    <button onClick={this.logout} className="btn btn-warning my-2">Log Out</button>
                    :
                    <button onClick={this.login} className="btn btn-warning my-2">Log In</button>
                    }
                </Navbar.Collapse>
            </Navbar>
            
        )
    }
}

export default withRouter(NaviBar);