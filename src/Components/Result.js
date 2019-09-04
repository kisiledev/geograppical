import React, {Component} from 'react';
import Flag from 'react-flags';
import { Link } from 'react-router-dom';
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../App.css';
import { db } from './Firebase/firebase'


class Result extends Component {
    state = {
        loggedIn: true,
        favorite: false
    }
    makeFavorite = (e, country) => {
        e.persist();
        if(!this.props.user){
          let modal = {
            title: 'Not Logged In',
            body: 'You need to sign in to favorite countries',
            primaryButton: 
            <Button variant="primary" onClick={this.props.login}>
            Sign In/ Sign Up
            </Button>
          }
          this.props.setModal(modal)
          this.props.handleOpen();
        } else {
          if(!this.state.favorite){
            db.collection(`users/${this.props.user.uid}/favorites`).doc(`${country.name}`).set({
                  country
            }).then(() => {
              console.log(`Added ${country.name} to favorites`)
              this.setState({message: {style: "success", content: `Added ${country.name} to favorites`}, favorite: true})
            }).catch((err) => {
              console.error(err)
              this.setState({message: {style: "danger", content: `Error adding ${country.name} to favorites, ${err}`}})
            })
          } else {
            this.setState({favorite: false})
          }
        }
    }
    render() {
        return(
            <div className="mr-md-3 card mb-3">
                <div className="result media">
                    <div className="media-body">
                    <h4 className="title">
                        {this.props.name} ({this.props.flagCode})
                        <br/><small>Capital: {this.props.capital} | Pop: {this.props.population}</small> 
                    </h4>
                    <p className="subregion">
                    <strong>Location: </strong>{this.props.subregion}
                    </p>
                    <Link to={`${process.env.PUBLIC_URL}/${this.props.name}`} className="btn btn-success btn-sm" onClick={() => this.props.getCountryInfo(this.props.name, this.props.capital)}>Read More</Link>
                    </div>
                    {this.state.loggedIn && <div className="stars"><FontAwesomeIcon onClick={(e) => this.makeFavorite(e, this.props.country)} size="2x" value={this.props.country} color={this.state.favorite ? "gold" : "gray"} icon={faStar} /></div>}
                    <Flag 
                        className="img-thumbnail"
                        name={(this.props.flagCode)? this.props.flagCode : "_unknown"}
                        format="svg"
                        pngSize={64}
                        shiny={false}
                        alt={`${this.props.name}'s Flag`}
                        basePath="/img/flags"
                    />  
                    
                </div>
                
            </div>

            // <div className="card h-100 col-sm-12 col-md-9 mb-3">
            //     <img className="card-img" src={this.props.flag} alt={this.props.imgalt}/>
            //     <div className="card-img-overlay">
            //         <h5 className="card-title">{this.props.name} <small>Capital: {this.props.capital}</small></h5>
            //         <p>Pop: {this.props.population}</p>
            //         <p className="card-text"><strong>Region: </strong>{this.props.region}</p>
            //         <p className="subregion"><strong>Subregion: </strong>{this.props.subregion}</p>
            //         <button className="btn btn-primary btn-sm">Read More</button>
            //     </div>
            // </div>
        )
    }
}

export default Result;