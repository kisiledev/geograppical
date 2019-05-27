import React, {Component} from 'react';
import JSONTree from 'react-json-tree';
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
                <button className="btn btn-block btn-primary" value={"default"} onClick={() => this.props.changeView()}>Back to Results</button>
                <JSONTree data={this.props.countryDetail}/>
                <div className="card mb-3">
                    <AudioPlayer 
                    nation={this.props.countryDetail}
                    audio={this.props.countryDetail.government.national_anthem.audio_url}/>
                    <h1>{this.props.countryDetail.name}</h1>
                    <hr />
                    <h2>Geography</h2>
                    <p>{this.props.countryDetail.geography.location}</p>
                    <p>{this.props.countryDetail.geography.climate}</p>
                    <p>{this.props.countryDetail.geography.terrain}</p>
                    <p>{this.props.countryDetail.introduction.background}</p>
                    <p>{this.props.countryDetail.people.demographic_profile}</p>
                    <button className="btn btn-primary" value={"default"} onClick={() => this.props.changeView()}>Back to Results</button>
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
            /> : null }
        </div>
      )
    }
  }
  
  export default DetailView;