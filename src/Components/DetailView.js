import React, {Component} from 'react';
import JSONTree from 'react-json-tree';
import '../App.css';
import Sidebar from './Sidebar';

class DetailView extends Component {

    state = {
        name: "",
        location: "",
        type: "",
        excerpt: "Enter Value Here",
        value: "Select Locale Type",
        imgurl: "",
        imgalt: ""
    };
    handleChange = (e) => {
        const {name, location, type, excerpt, imgurl, value, checked} = e.target;
        type === "checkbox" ? this.setState({[name]: checked}) : this.setState({
            [name]: value,
            [location]: value,
            [type]: value,
            [excerpt]: value,
            [imgurl]: value
        })
        console.log(this.state.imgurl);
    };

    handleSubmit = (event) =>  {
        event.persist();
        event.preventDefault();
        const {name, location, type, excerpt, imgurl} = event.target;
        this.props.addCountry(name.value, location.value, type.value, excerpt.value, imgurl.value);
        this.setState({
            name: "",
            location: "",
            type: "",
            excerpt: "Enter Value Here",
            value: "Select Locale Type",
            imgurl: ""
            
        })
      }
      
    
    render() {
        const totalRegions = this.props.geodata.map(a => a.region)
    function getOccurrence(array, value) {
      return array.filter((v) => (v === value)).length;
    }
    let uniqueRegions = totalRegions.filter((v, i, a) => a.indexOf(v) === i);
    uniqueRegions = uniqueRegions.filter(Boolean);
      return(
        <div className="row">
            <div className="col-sm-12 col-md-8">
                <JSONTree data={this.props.countryDetail}/>
            </div>
            <Sidebar 
                geodata = {this.props.geodata}
                totalRegions = {totalRegions}
                uniqueRegions = {uniqueRegions}
                getOccurrence = {getOccurrence}
            />
        </div>
      )
    }
  }
  
  export default DetailView;