import React, {Component} from 'react';
import '../App.css';

class Search extends Component {

  render() {
    return(
      <div>
        <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Type a country to begin" aria-label="" aria-describedby="basic-addon1" value={this.props.searchText} onChange={this.props.passInput}/>
            <span className="fa fa-search"></span>
            <div className="input-group-append">
            </div>
          </div>
          <div className="alert alert-info" role="alert">
            Can't find what you're looking for? Create an entry here. <button className="btn btn-outline-dark" onClick={this.props.changeView} value="add">Add</button>
          </div>
        </div>  
    );
  }
}

export default Search;