/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';
import Axios from 'axios';
import Collapse from 'react-bootstrap/Collapse';
import '../App.css';

class Sidebar extends Component {

    state = {};

    componentDidMount(){
        this.filterRegion();
        console.log(this.props.uniqueRegions);
        console.log('running')
        this.loadMore();
        this.setDynamicRegions(this.props.uniqueRegions);
    }

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
        
    loadMore = (region) => {
        let stateRegion = [region];
    }
    setDynamicRegions = regions => {
        if (!regions) {
          return;
        }
        if(regions)
        console.log(regions);
        const regionsState = {};
      
        regions.forEach((item, index) => {
            console.log(item)
          regionsState[item] = { visible: 0 };
        });
      
        // set state here outside the foreach function
         this.setState({
           regionsState: regionsState
         });
      };        
    // setDynamicRegions = regions => {
    // if (!regions) {
    //     return;
    // }

    // console.log({regions});

    // const regionsState = {};

    // regions.forEach((item, index) => {
    //     console.log(item)
    //     this.setState(prevState => ({
    //         [item]: {visible: 5, countries: []}
    //     }));
    //     console.log(this.state[item])
    // });
    // };

             handleRegion =(region) =>{
                this.filterRegion(region);
                if(this.state[region] && this.state[region].open){
                    this.setState(prevState =>({
                        [region]: {...prevState[region],
                            open: false
                        }
                      }))
                } else {
                    this.setState(prevState =>({
                        [region]: {...prevState[region],
                            open: true
                        }
                      }))
                }
            }
                      
    render(){
        const handleSidebarClick = (string) => {
            console.log(string);
            this.props.handleSideBar(string);
            if(string.length > 3)
            this.handleRegion(string); 
        };

        
        // const loadMore = (region) =>  {
        //     console.log(this.state[region])
        //     if(this.state[region]){
        //         if(this.state[region] && !this.state[region].visible){
        //             console.log(this.state[region].visible)
        //             this.setState(prevState => ({
        //                 [region]: {
        //                     visible: 5,
        //                     open: false
        //                 }
        //             }))
        //         } else {
        //             console.log(this.state[region].visible);
        //             this.setState(prevState => ({
        //                 [region]: {
        //                     visible: prevState[region].visible +5,
        //                     open: false
        //                 }
        //             }))   
        //         }
        //     }
        // }
        return (
            <nav className="sidebar card col-md-3">
                <div className="sidebar-sticky">
                    <h5 className="text-center" onClick={() => this.setDynamicRegions(this.props.uniqueRegions)}>
                        <strong>Countries:</strong> 
                        {this.props.geodata.length} 
                    </h5>
                    {/* <div className="collapse navbar-collapse"> */}
                    <ul className="nav nav-pills flex-column">
                    {this.props.uniqueRegions.map( (region, index ) => 
                        <li className="nav-item" key={index} onClick={() => this.handleRegion(region)} >
                            <span className="nav-link bg-success mb-1">
                                <strong>{region}</strong> - {this.props.getOccurrence(this.props.totalRegions, region)}
                            </span>
                            <Collapse in={this.state[region] && this.state[region].open}>
                            <ul>
                            {this.state[region] && this.state[region].countries[0] && this.state[region].countries.map((country, index) => 
                                <li key={index} className="nav-item" onClick={() => handleSidebarClick(country.alpha2Code)}>
                                    <span className="nav-link bg-info mb-1">{country.name}</span>
                                </li>
                            )}
                            {this.state[region] && <button onClick={() => this.loadMore(region)} className="load-more nav-link bg-warning mb-1">Load more</button>}
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