import React, {Component} from 'react';
import RecursiveProperty from './DataList';
import Flag from 'react-flags'
import '../App.css';
import Sidebar from './Sidebar';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class DetailView extends Component {
    render() {
    const totalRegions = this.props.data.map(a => a.geography.map_references)
    function getOccurrence(array, value) {
      return array.filter((v) => (v === value)).length;
    }
    let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
    uniqueRegions = uniqueRegions.filter(Boolean)
    console.log(uniqueRegions);
    console.log(this.props.countryDetail.isoCode)
      return(
        <div className="row">
            <div className="col-sm-12 col-md-9">
                <div className="card mb-3">
                <div className="row">
                <button className="btn btn-primary align-self-start" onClick={() => this.props.changeView('default')}><FontAwesomeIcon icon={faArrowLeft}/> Back to Results</button>
                <Flag
                  className="detailFlag align-self-end text-right img-thumbnail"
                  name={this.props.countryDetail.isoCode}
                  format="svg"
                  pngSize={64}
                  shiny={false}
                  alt={`${this.props.countryDetail.name}'s Flag`}
                  basePath="/img/flags"
                />
                </div>
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
            /> : null }
        </div>
      )
    }
  }
  
  export default DetailView;