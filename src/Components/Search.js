import React, {Component} from 'react';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../App.css';

class Search extends Component {

  render() {
    return(
      <div>
        <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Type a country to begin" aria-label="" aria-describedby="basic-addon1" value={this.props.searchText} onChange={this.props.passInput}/>
            <div className="input-group-append">
            </div>
          </div>
          { (this.props.view === "default") ?   
            (<div className="alert alert-info text-center" role="alert">
            <small>
              Add to Database <button className="btn btn-sm btn-outline-dark" onClick={this.props.changeView} value="add">
              <FontAwesomeIcon icon={faPlus} />
              </button>
              </small>
            </div>) :
            <div className="alert alert-info text-center" role="alert">
            <small>
              Return to Database  <button className="btn btn-sm btn-outline-dark" onClick={this.props.changeView}>
              <FontAwesomeIcon icon={faHome} />
              </button>
              </small>
            </div>
          }
        </div>  
    );
  }
}

export default Search;