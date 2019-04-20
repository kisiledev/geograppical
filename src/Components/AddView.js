import React, {Component} from 'react';
import '../App.css';

class AddView extends Component {

    state = {
        name: "",
        location: "",
        type: "",
        excerpt: "Enter Value Here",
        value: "Select Locale Type"
    };
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            [e.target.location]: e.target.value,
            [e.target.type]: e.target.value
        })
    };

    handleSubmit = (event) =>  {
        event.persist();
        event.preventDefault();
        console.log("submitted");
        console.log(event.target.name.value, event.target.location.value, event.target.type.value, event.target.excerpt.value);
        this.props.addCountry(event.target.name.value, event.target.location.value, event.target.type.value, event.target.excerpt.value);
        this.setState({
            name: "",
            location: "",
            type: "",
            excerpt: "Enter Value Here",
            value: "Select Locale Type"
        })
      }
    
    render() {
      return(
        <div className="addNew col-8">
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
                <div className="form-group">
                    <label htmlFor="exampleFormControlFile1" className="btn btn-default btn-file">Upload Image File</label>
                    <input type="file" className="form-control-file" id="exampleFormControlFile1"/>
                </div>
                <div className="btn-group">
                    <button type="submit" className="btn btn-success">Submit</button>
                    <button type="button" className="btn btn-danger" onClick={this.props.changeView}>Cancel</button>
                </div>
            </form>
        </div>
      )
    }
  }
  
  export default AddView;