import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { auth, googleProvider } from './Firebase/firebase'
import { Redirect, withRouter } from 'react-router-dom'
import * as ROUTES from '../Constants/Routes'
import SideCountry from './SideCountry.jsx'


class SideNaviBar extends React.Component {
    componentDidMount = ()=> {
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
        const totalRegions = this.props.data.map(a => a.geography.map_references)
    function getOccurrence(array, value) {
      return array.filter((v) => (v === value)).length;
    }
    let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
    uniqueRegions = uniqueRegions.filter(Boolean)
        return(
            <Navbar className="flex-column sidenav" bg="dark" variant="dark">
                <Navbar.Brand href="/">Geograppical</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Nav>
                    <Nav.Link className="navbarlink" href="/" onClick={(e) => this.props.changeMode(e)} >Learn</Nav.Link>
                    <Nav.Link className="navbarlink" href="/play" onClick={(e) => this.props.changeMode(e)} >Play</Nav.Link>
                    <Nav.Link href={ROUTES.ACCOUNT} title="Account" className="navbarlink">Account</Nav.Link>
                    {/* <Nav.Link className="sublinks">Favorites</Nav.Link>
                    <Nav.Link className="sublinks">Scores</Nav.Link> */}
                </Nav>
                <SideCountry 
                data={this.props.data}
                changeView = {this.props.changeView}
                viewSidebar={this.props.viewSidebar}
                totalRegions = {totalRegions}
                uniqueRegions = {uniqueRegions}
                getOccurrence = {getOccurrence}
                sidebar={this.props.sidebar}
                getCountryInfo = {this.props.getCountryInfo}
                handleSideBar = {this.props.handleSideBar}
                hoverOffRegion = {this.props.hoverOffRegion}
                hoverOnRegion = {this.props.hoverOnRegion}
                filterCountryByName = {this.props.filterCountryByName}
                hoverOnCountry = {this.props.hoverOnCountry}
                hoverOffCountry = {this.props.hoverOffCountry}
            />
            </Navbar>
            
        )
    }
}

export default withRouter(SideNaviBar);