import React, {Component} from 'react';
import '../App.css';

class AddView extends Component {

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
      return(
        <div className="col-sm-12 col-md-9">
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="">Locale Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={this.state.name} 
                        onChange={this.handleChange} 
                        className="form-control" 
                        id="localeName" 
                        placeholder="Enter locale name"/>
                    <small id="nameHelp" className="form-text text-muted">Valid countries only: No Wakanda, Sokovia, or Shangri-la please.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="">Location</label>
                    <input 
                        type="text" 
                        name="location" 
                        value={this.state.location} 
                        onChange={this.handleChange} 
                        className="form-control" 
                        id="localeLocation" 
                        placeholder="Enter locale location"/>
                    <small id="locationHelp" className="form-text text-muted">On what continent or in what global region does your submission exist? </small>
                </div>
                <div className="form-group">
                    <label htmlFor="">Type</label>
                    <select 
                        name="type" 
                        value={this.state.type} 
                        onChange={this.handleChange} 
                        className="custom-select">
                            <option >Select Locale Type</option>
                            <option value="continent">Continent</option>
                            <option value="country">Country</option>
                            <option value="region">Region</option>
                    </select>
                    <small id="typeHelp" className="form-text text-muted">Is it a continent, country, state, or region? </small>
                </div> 
                <div className="form-group">
                    <label htmlFor="exampleFormControlTextarea1">Enter some information about the locale.</label>
                    <textarea 
                        name="excerpt" 
                        value={this.state.excerpt} 
                        onChange={this.handleChange} 
                        className="form-control" 
                        id="exampleFormControlTextarea1" 
                        rows="5">
                    </textarea>
                </div>
                <div className="form-group text-center">
                    <label htmlFor="exampleFormControlFile1" className="radio-label text-center">Zambia <br/>
                        <input 
                            type="radio" 
                            name="imgurl" 
                            value="img/zambia.jpg" 
                            checked={this.state.imgurl === "img/zambia.jpg"}
                            className="form-control-radio" 
                            onChange={this.handleChange}
                        />
                        <img src="img/zambia.jpg"  alt="" className="img-thumbnail"/>
                    </label>
                    <label htmlFor="exampleFormControlFile1" className="radio-label text-center">Jamaica <br/>
                        <input 
                            type="radio" 
                            name="imgurl" 
                            value="img/jamaica.jpg"
                            checked={this.state.imgurl === "img/jamaica.jpg"}
                            className="form-control-radio" 
                            onChange={this.handleChange}
                        />
                        <img src="img/jamaica.jpg"  alt="" className="img-thumbnail"/>
                    </label>                    
                </div>
                <div className="form-group text-center">
                    <div className="btn-group btn-block">
                        <button type="submit" className="btn btn-lg btn-success">Submit</button>
                        <button type="button" className="btn btn-lg btn-danger" onClick={this.props.changeView}>Cancel</button>
                    </div>
                </div>
                
            </form>
        </div>
      )
    }
  }
  
  export default AddView;