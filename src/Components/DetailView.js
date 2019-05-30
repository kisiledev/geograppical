import React, {Component} from 'react';
import RecursiveProperty from './DataList';
import '../App.css';
import Sidebar from './Sidebar';
import { faAngleUp, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class DetailView extends Component {
    render() {
    const totalRegions = this.props.data.map(a => a.data.geography.map_references)
    function getOccurrence(array, value) {
      return array.filter((v) => (v === value)).length;
    }
    let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
    uniqueRegions = uniqueRegions.filter(Boolean)
    console.log(uniqueRegions);
      return(
        <div className="row">
            <div className="col-sm-12 col-md-9">
                <div className="card mb-3">
                <button className="btn btn-primary align-self-start" onClick={() => this.props.changeView('default')}><FontAwesomeIcon icon={faArrowLeft}/> Back to Results</button>
                <RecursiveProperty
                  property={this.props.countryDetail} 
                  expanded={Boolean}
                  propertyName={this.props.countryDetail.name} 
                  excludeBottomBorder={false} 
                  rootProperty={true}
                />
                </div>
            </div>
            {this.props.sidebar === "Show" ?
            <Sidebar 
                data={this.props.data}
                geodata = {this.props.geodata}
                viewSidebar={this.props.viewSidebar}
                totalRegions = {totalRegions}
                uniqueRegions = {uniqueRegions}
                getOccurrence = {getOccurrence}
                sidebar={this.props.sidebar}
                getCountryInfo = {this.props.getCountryInfo}
                handleSideBar = {this.props.handleSideBar}
            /> : null }
        </div>
      )
    }
  }
  
  export default DetailView;