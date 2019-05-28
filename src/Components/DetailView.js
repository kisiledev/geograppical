import React, {Component} from 'react';
import RecursiveProperty from './DataList';
import '../App.css';
import Sidebar from './Sidebar';
import AudioPlayer from './AudioPlayer';

class DetailView extends Component {
    render() {
        const totalRegions = this.props.geodata.map(a => a.region)
    function getOccurrence(array, value) {
      return array.filter((v) => (v === value)).length;
    }
    let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
    uniqueRegions = uniqueRegions.filter(Boolean);
      return(
        <div className="row">
            <div className="col-sm-12 col-md-9">
                <div className="card mb-3">
                <button className="btn btn-block btn-primary" onClick={() => this.props.changeView('default')}>Back to Results</button>
                <RecursiveProperty
                  property={this.props.countryDetail} 
                  expanded={Boolean}
                  propertyName={this.props.countryDetail.name} 
                  excludeBottomBorder={false} 
                  rootProperty={true}
                />
                <button className="btn btn-primary" onClick={() => this.props.changeView('default')}>Back to Results</button>
                </div>
            </div>
            {this.props.sidebar === "Show" ?
            <Sidebar 
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