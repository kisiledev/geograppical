/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';
import Axios from 'axios';
import Collapse from 'react-bootstrap/Collapse';
import '../App.css';

class Sidebar extends Component {

    state = {};

    componentDidUpdate(prevProps, prevState) {
        // only update chart if the data has changed
        if (prevProps.uniqueRegions !== this.props.uniqueRegions) {
          this.setDynamicRegions(this.props.uniqueRegions)
        }
      };
    filterRegion = (region) =>{
        if(region !==undefined ){
            this.setState({
                [region]: {countries: ['']}
            })
          return Axios
           .get('https://restcountries.eu/rest/v2/region/' + region)
           .then(res => {
             if(res.status === 200 && res !== null){
              this.setState(prevState =>({
                [region]: {...prevState[region],
                    countries: (res && res.data || [])} 
              }))
              } else {
               throw new Error('No country found');
             }
             })
             .catch(error => {
               console.log(error)
               return []
             });
        };
    };
        
    setDynamicRegions = regions => {
        if (!regions) {
            console.log('no regions')
          return;
        }
        if(regions) 
        console.log(regions);
        const regionsState = {};
      
        regions.forEach((region, index) => {
            if(this.state[region] && this.state[region].countries[0]){
                regionsState[region] = { visible: 5, start: 0, countries: this.state[region].countries, open: false};
            } else {
                this.filterRegion(region);
                regionsState[region] = { visible: 5, start: 0, countries: [], open: false};
            }
        });
      
        // set state here outside the foreach function
         this.setState((prevState => ({
           ...regionsState
         })))
      };




    updateOpen = (region) => {
            let open = {start: 0, visible: 5, open: !this.state[region].open, countries: this.state[region].countries}
            this.setState(prevState => ({ [region]: open}));
            console.log(this.state[region].open);
       };
    loadMore = (event, region) =>  {
        console.log(event);
        event.stopPropagation();
        let more = {visible: this.state[region].visible + 5, start: this.state[region].start, open: true, countries: this.state[region].countries}
        console.log(more);
        this.setState(prevState => ({[region]: more}));
        console.log(this.state[region].visible)
    }
    prevFive = (event, region) =>  {
        console.log(event);
        event.stopPropagation();
        let more = {visible: this.state[region].visible -5, start: this.state[region].start - 5, open: true, countries: this.state[region].countries}
        console.log(more);
        this.setState(prevState => ({[region]: more}));
        console.log(this.state[region].visible)
    }
    nextFive = (event, region) =>  {
        console.log(event);
        event.stopPropagation();
        let more = {visible: this.state[region].visible +5, start: this.state[region].start + 5, open: true, countries: this.state[region].countries}
        console.log(more);
        this.setState(prevState => ({[region]: more}));
        console.log(this.state[region].visible)
    }
      
    handleRegion =(e, region) =>{
        e.stopPropagation();
        this.updateOpen(region);
        // this.updateVisibility(region);       
    }
    render(){
        const handleSidebarClick = (region) => {
            console.log(region);
            this.props.handleSideBar(region);
            if(region.length > 3)
            this.handleRegion(region);


        };
        return (
            <nav className="sidebar card col-md-4">
                <div className="sidebar-sticky">
                    <h5 className="text-center">
                        <strong>Countries:</strong> 
                        {this.props.geodata.length} 
                    </h5>
                    {/* <div className="collapse navbar-collapse"> */}
                    <ul className="nav nav-pills flex-column">
                    {this.props.uniqueRegions.map( (region, index ) => 
                        <li className="nav-item" key={index} onClick={(e) => this.handleRegion(e, region)} >
                            <span className="nav-link bg-success mb-1">
                                <strong>{region}</strong> - {this.props.getOccurrence(this.props.totalRegions, region)}
                            </span>
                            <Collapse in={this.state[region] && this.state[region].open}>
                            <ul>
                            {this.state[region] && this.state[region].countries[0] && this.state[region].countries.slice(this.state[region].start, this.state[region].visible).map((country, index) => 
                                <li key={index} className="nav-item" onClick={() => handleSidebarClick(country.alpha2Code)}>
                                    <span className="nav-link bg-info mb-1">{country.name}</span>
                                </li>
                            )}
                            {this.state[region] && this.state[region].open && (this.state[region].visible < this.state[region].countries.length) && 
                                <div className="btn-group">
                                <button 
                                    onClick={(e) => this.loadMore(e, region)} 
                                    className="btn load-more nav-link bg-secondary mt-1 mb-3">
                                    Load More
                                </button> 
                                <button 
                                    onClick={(e) => this.prevFive(e, region)} 
                                    className="btn load-more nav-link bg-warning mt-1 mb-3">
                                    Previous {this.state[region].visible - this.state[region].start}
                                </button>
                                <button 
                                    onClick={(e) => this.nextFive(e, region)} 
                                    className="btn load-more nav-link bg-success mt-1 mb-3">
                                    Next {this.state[region].visible - this.state[region].start}
                                </button>
                                </div>}
                            </ul>
                            </Collapse>
                        </li>
                        )}
                    </ul>
                    {/* </div> */}
                </div>
            </nav>
        )
    }
}

export default Sidebar;