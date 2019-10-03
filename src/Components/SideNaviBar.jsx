import React, { useState } from 'react';
import { Navbar, Nav, Collapse } from 'react-bootstrap';
import {  withRouter } from 'react-router-dom'
import * as ROUTES from '../Constants/Routes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown} from '@fortawesome/free-solid-svg-icons';
import SideCountry from './SideCountry.jsx'


const SideNaviBar = props => {
    const [expanded, setExpanded] = useState(false);

    // const login = () => {
    //     auth.signInWithPopup(googleProvider)
    //     .then((result) => {
    //         const user = result.user;
    //         console.log(user)
    //     }).catch((error) => {
    //         console.log(error)
    //         console.log(error.message)
    //     })
    // }
    const expandLinks = (type) => {
        if(!props.user){
            props.history.push('/login');
        }
        setExpanded(!expanded);
        type && props.handleData(type) 
        console.log('closed')
    }
    const closeNav = () => {
        console.log('close bar')
        setExpanded(false)
    }
    // const logout = () => {
    //     auth.signOut()
    //     return <Redirect to="/" />    
    // }
    const totalRegions = props.data.map(a => a.geography.map_references)
    function getOccurrence(array, value) {
      return array.filter((v) => (v === value)).length;
    }
    let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
    uniqueRegions = uniqueRegions.filter(Boolean);
    
        return (
            <Navbar className="flex-column sidenav" bg="dark" variant="dark">
                <Navbar.Brand href="/">Geograppical</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Nav>
                    <Nav.Link className="navbarlink" href="/" onClick={(e) => props.changeMode(e)} >Home</Nav.Link>
                    <Nav.Link className="navbarlink" href="/play" onClick={(e) => props.changeMode(e)} >Games</Nav.Link>
                        <Nav>
                        <Nav.Link href={ROUTES.ACCOUNT} title="Account" onMouseEnter={() => expandLinks()} onMouseLeave={() => expandLinks()} className="navbarlink">Account {props.user && <FontAwesomeIcon className="ml-1 align-middle" icon={!expanded ? faAngleDown : faAngleUp} />}</Nav.Link>
                        </Nav>
                    {props.user && 
                    <Collapse in ={expanded}>  
                        <Nav onSelect = {closeNav}>
                            <Nav.Link onSelect = { closeNav } className="sublinks" onClick={() => expandLinks("favorites")}>Favorites</Nav.Link>
                            <Nav.Link onSelect = { closeNav } className="sublinks" onClick={() => expandLinks("scores")}>Scores</Nav.Link>
                            <Nav.Link onSelect = { closeNav } href={ROUTES.EDIT} className="sublinks">Edit</Nav.Link>
                        </Nav>
                    </Collapse>
                    }
                </Nav>
                <SideCountry 
                data={props.data}
                changeView = {props.changeView}
                viewSidebar={props.viewSidebar}
                totalRegions = {totalRegions}
                uniqueRegions = {uniqueRegions}
                getOccurrence = {getOccurrence}
                sidebar={props.sidebar}
                getCountryInfo = {props.getCountryInfo}
                handleSideBar = {props.handleSideBar}
                hoverOffRegion = {props.hoverOffRegion}
                hoverOnRegion = {props.hoverOnRegion}
                filterCountryByName = {props.filterCountryByName}
                hoverOnCountry = {props.hoverOnCountry}
                hoverOffCountry = {props.hoverOffCountry}
            />
            </Navbar>
            
        )
}

export default withRouter(SideNaviBar);