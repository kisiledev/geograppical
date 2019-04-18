import React, {Component} from 'react';
import '../App.css';

class Search extends React.Component {

  openAddNew(){
    console.log('Add New');
  }
  render() {
    return(
      <div>
        <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1"/>
            <div className="input-group-append">
              <button className="btn btn-primary" type="button" >Search</button>
            </div>
          </div>
          <div className="alert alert-info" role="alert">
            Can't find what you're looking for? Create an entry <a href="" onClick={this.openAddNew()}> here.</a>
          </div>
        </div>
    );
  }
}

export default Search;