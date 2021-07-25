import React from 'react';
// import { faPlus } from "@fortawesome/free-solid-svg-icons";
// import { faHome } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../App.css';

const Search = props => {

    return(
      <div>
        <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Type a country to begin" aria-label="" aria-describedby="basic-addon1" value={props.searchText} onChange={this.props.passInput}/>
            <div className="input-group-append">
            </div>
          </div>
        </div>  
    );
}

export default Search;