import React, {useState, useEffect} from 'react';
import Flag from 'react-flags';
import { Link } from 'react-router-dom';
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../App.css';
import { db } from './Firebase/firebase'
// import * as ROUTES from '../Constants/Routes';


const Result = props => {
  // const [show, setShow] = useState(false)
  const [favorite, setFavorite] = useState(false)
  // const [message, setMessage] = useState('');

    useEffect(() => {
      props.user && checkFavorite(props.country)
    }, [])

    useEffect(() => {
      props.user && checkFavorite(props.country)
    }, [props.filtered]);
 
    const checkFavorite = (country) => {
      const docRef = db.collection(`users/${props.user.uid}/favorites`).doc(`${country}`);
      docRef.get()
      .then(doc => {
        if(doc){
          if(doc.exists){
            const data = doc.data()
            setFavorite(true)
            console.log(data)
          } else {
            setFavorite(false)
          }
        }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
    }
    const makeFavorite = (e, country) => {
      e.persist();
      // setShow(true)
      if(!props.user){
        // setMessage({style: "warning", content: `You need to sign in to favorite countries. Login `, link: ROUTES.SIGN_IN, linkContent: 'here'})
      } else {
        if(!favorite){
          db.collection(`users/${props.user.uid}/favorites`).doc(`${country.name}`).set({
                country
          }).then(() => {
            console.log(`Added ${country.name} to favorites`)
            // setMessage({style: "success", content: `Added ${country.name} to favorites`})
            setFavorite(true)
          }).catch((err) => {
            console.error(err)
            // setMessage({style: "danger", content: `Error adding ${country.name} to favorites, ${err}`})
          })
        } else {
          db.collection(`users/${props.user.uid}/favorites`).doc(`${country.name}`).delete()
          .then(() => {
            console.log(`Removed ${country.name} from favorites`)
            // setMessage({style: "warning", content: `Removed ${country.name} from favorites`})
            setFavorite(false)
            // setShow(true)
          }).catch((err) => {
            console.error(err)
            // setMessage({style: "danger", content: `Error adding ${country.name} to favorites, ${err}`})
          })
        }
      }
    }
        return(
            <div className="mr-md-3 card mb-3">
                <div className="result media">
                    <div className="media-body">
                    <h4 className="title">
                        {props.name} ({props.flagCode})
                        <br/><small>Capital: {props.capital && props.capital.split(';')[0]} | Pop: {props.population}</small> 
                    </h4>
                    <p className="subregion">
                    <strong>Location: </strong>{props.subregion}
                    </p>
                    <Link to={`${process.env.PUBLIC_URL}/${props.name}`} className="btn btn-success btn-sm" onClick={() => props.getCountryInfo(props.name, props.capital)}>Read More</Link>
                    </div>
                    {props.user && <div className="stars"><FontAwesomeIcon onClick={(e) => makeFavorite(e, props.country)} size="2x" value={props.country} color={favorite ? "gold" : "gray"} icon={faStar} /></div>}
                    <Flag 
                        className="img-thumbnail"
                        name={(props.flagCode)? props.flagCode : "_unknown"}
                        format="svg"
                        pngSize={64}
                        shiny={false}
                        alt={`${props.name}'s Flag`}
                        basePath="/img/flags"
                    />  
                    
                </div>
                
            </div>

            // <div className="card h-100 col-sm-12 col-md-9 mb-3">
            //     <img className="card-img" src={props.flag} alt={props.imgalt}/>
            //     <div className="card-img-overlay">
            //         <h5 className="card-title">{props.name} <small>Capital: {props.capital}</small></h5>
            //         <p>Pop: {props.population}</p>
            //         <p className="card-text"><strong>Region: </strong>{props.region}</p>
            //         <p className="subregion"><strong>Subregion: </strong>{props.subregion}</p>
            //         <button className="btn btn-primary btn-sm">Read More</button>
            //     </div>
            // </div>
        )
}

export default Result;