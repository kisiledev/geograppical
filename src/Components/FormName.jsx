import React, {Component} from 'react';
import '../App.css';

class FormName extends Component {

    state = {
        value: ""
    };

    handleChange = (event) => {
        this.setState({
            value: event.target.value
        })
    }
    render() {
        return(
            <div className="form-group">
                <label htmlFor="">Locale Name</label>
                <input type="text" className="form-control" id="localeName" placeholder="Enter locale name" onChange={this.handleChange}/>
                <small id="nameHelp" className="form-text text-muted">Valid countries only: No Wakanda, Sokovia, or Shangri-la please.</small>
            </div>
        )
    }
};

export default FormName; 