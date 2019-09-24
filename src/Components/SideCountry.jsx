/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';
import { BreakpointProvider } from 'react-socks';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../App.css';
import Sidebar from './Sidebar.jsx';


class SideCountry extends Component {
    state = {
        sidebar: "Show",
        loading: true,
    };
    componentDidMount(){
            this.setState({loading: true}, this.setDynamicRegions(this.props.uniqueRegions))
    }
    componentDidUpdate(prevProps, prevState) {
        if(this.props.sidebar !==prevProps.sidebar){
            this.setState({loading: false})
        }
        if (prevProps.uniqueRegions !== this.props.uniqueRegions && this.props.uniqueRegions.length > 0) {
          this.setDynamicRegions(this.props.uniqueRegions)
        }
        if(this.state.loading !== prevState.loading){
            this.setState({loading: false})
        }
    };
    removeNull(array){
        return array
          .filter(item => 
            item.government.capital !== undefined && 
            item.government.country_name !==undefined && 
            item.name)
          .map(item => Array.isArray(item) ? this.removeNull(item) : item);
      }

    getRegion = (region) => {
        let searchDB = Object.values(this.props.data);
        this.removeNull(searchDB);
        let match = searchDB.filter(place => place.geography.map_references === region);
        return match;
    }
    
    setDynamicRegions = regions => {
        if (!regions) {
            console.log('no regions')
          return;
        }
        const regionsState = {};
        regions.forEach((region) => {
            if(this.state[region] && this.state[region].countries[0]){
                regionsState[region] = { visible: 5, start: 0, countries: this.state[region].countries, open: false};
            } else {
                this.getRegion(region);
                regionsState[region] = { visible: 5, start: 0, countries: this.getRegion(region), open: false};
            }
        });
            this.setState({...regionsState, loading: false})
    };
    updateOpen = (region) => {
        const open = {start: 0, visible: 5, open: !this.state[region].open, countries: this.state[region].countries}
        this.setState(({ [region]: open}));
    };
    viewSidebar = () => {
        if(this.state.sidebar === "Show"){
          this.setState(({sidebar: "Hide"}))
        } else {
            console.log('showing bar')
            this.setState(({sidebar: "Show"}))
        }
      }

    sidebarDataHandling = (event, region, change, start) => {
        event.stopPropagation();
        const more = {visible: this.state[region].visible + change, start: this.state[region].start + start, open: true, countries: this.state[region].countries}
        this.setState(({[region]: more}));
    }
      
    handleRegion =(e, region) =>{
        e.stopPropagation();
        this.updateOpen(region);
        // this.updateVisibility(region);       
    }

    render(){
        if(this.props === null){
        } else {
        return (
            <BreakpointProvider>
            <nav className="countriesnav">
                    <button 
                    className="btn btn-sm btn-block btn-outline-secondary mb-3" 
                    onClick={()=> this.viewSidebar()}
                    >
                    { (this.state.sidebar === "Hide") ? "Show" : "Hide"} Countries List
                    </button>
                {this.state.sidebar === "Show" ? 
                (this.state.loading ? <div className="mx-auto text-center"><FontAwesomeIcon icon={faSpinner} spin size="3x"/></div> : 
                <Sidebar {...this.props}/>): null}
            </nav>
            </BreakpointProvider>
        )
        }
    }
}

export default SideCountry;