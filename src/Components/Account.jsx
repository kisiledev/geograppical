import React, { useState, useEffect } from 'react';
import { db } from './Firebase/firebase';
import Flag from 'react-flags'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faAngleUp, faAngleDown, faTrashAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Alert, Badge } from 'react-bootstrap'
import Collapse from 'react-bootstrap/Collapse';
import { Link } from 'react-router-dom'


const Account = props => {
    const [loadingState, setLoadingState] = useState(false)
    const [favorites, setFavorites] = useState('')
    const [scores, setScores] = useState('')
    const [message, setMessage] = useState('')
    const [show, setShow] = useState(false)

    useEffect(() => {
        setLoadingState(true); 
        getFavoritesData();
        getScoresData();
    }, [])
    const deleteFavorite = (id) => {
        db.collection(`users/${props.user.uid}/favorites`).doc(id).delete()
        .then(() => {
          console.log(`Removed ${id} from favorites`)
          setShow(true)
          setMessage({style: "warning", content: `Removed ${id} from favorites`})
        }).catch((err) => {
          console.error(err)
          setMessage({style: "danger", content: `Error removing ${id} from favorites, ${err}`})
        })
    }
    const deleteScore = (id) => {
        db.collection(`users/${props.user.uid}/scores`).doc(id).delete()
        .then(() => {
          console.log(`Removed ${id} from scores`)
          setShow(true)
          setMessage({style: "warning", content: `Removed ${id} from scores`})
        }).catch((err) => {
          console.error(err)
          setMessage({style: "danger", content: `Error removing ${id} from scores, ${err}`})
        })
    }
    const getFavoritesData = () => {
        let countriesRef = db.collection(`/users/${props.user.uid}/favorites`);
        countriesRef.onSnapshot((querySnapshot) => {
            let data = [];
            querySnapshot.forEach( doc => {
                let info = {
                    id: doc.id,
                    data: doc.data().country
                }
                data.push(info);
                data["isOpen"] = true;
            })
            setFavorites({isOpen: false, data})
            setLoadingState(false)
        })
    }
    const getScoresData = () => {
        let scoresRef = db.collection(`/users/${props.user.uid}/scores`);
        scoresRef.onSnapshot((querySnapshot) => {
            let data = [];
            querySnapshot.forEach( doc => {
                let info = {
                    id: doc.id,
                    data: doc.data()
                }
                data.push(info);
                data["isOpen"] = true;
            })
            setScores({isOpen: false, data})
            setLoadingState(false)
        })
    }
    return(
            <div className="col-sm-12 col-md-8 mx-auto">
                {<Alert show={show} variant={message.style}>{message.content}</Alert>}
                <div className="card col-lg-8 col-xl-6 mx-auto mb-3">
                    <div className="row">
                        <div className="col-12 text-center">
                            <img className="avatar img-fluid" src={props.user ? (props.user.photoURL ? props.user.photoURL : require('../img/user.png')) : require('../img/user.png')} alt=""/>
                            
                        </div>
                        <div className="col-12 text-center">
                            <h5 className="mt-3">{props.user.displayName} </h5>
                            <p>Account created {new Date(props.user.metadata.creationTime).toLocaleDateString()}</p>
                            <p>{props.user.email}</p>
                            <p>{props.user.phoneNumber ? props.user.phoneNumber : "No phone number added"}</p>
                            {loadingState ? <FontAwesomeIcon className="my-5" icon={faSpinner} spin size="2x"/> :
                            (
                            <>
                            <h6>Stats</h6>
                            <p>{favorites && favorites.data.length} {favorites && favorites.length === 1 ? "Favorite" : "Favorites"}</p>
                            <p>{scores && scores.data.length} Scores</p>
                            </>
                            )}
                        </div>
                        <div className="col-12 text-center">
                            <Link 
                                className="btn btn-success" 
                                to={`${process.env.PUBLIC_URL}/account/edit`}>
                                <FontAwesomeIcon className="acctedit" icon={faPencilAlt}/>Edit Account
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-lg-5 card datacard mx-auto my-1">
                        <h5 className="list-group-item d-flex align-items-center" onClick={() => props.handleData("favorites")}>
                            Favorites
                            <Badge variant="primary">
                                {loadingState ? 
                                <FontAwesomeIcon icon={faSpinner} spin /> : favorites && favorites.data.length>0 && favorites.data.length}
                            </Badge>
                                {favorites && <FontAwesomeIcon className="align-text-top" icon={props.favorites ? faAngleDown : faAngleUp} />}
                        </h5>
                        {loadingState ? null : 
                            (
                            favorites &&
                            <Collapse in={props.favorites}>
                            <ul className="list-group list-group-flush">
                                {favorites && favorites.data.length > 0 ? 
                                    favorites.data.map(favorite =>
                                    <li className="list-group-item" key={favorite.id}>
                                        <h5>{favorite.id} - <small>{favorite.data.government.capital.name.split(';')[0]}</small></h5>
                                        <div className="d-flex justify-content-between">
                                        <Link to={`${process.env.PUBLIC_URL}/${props.simplifyString(favorite.id)}`} >
                                            <Flag
                                                className="favFlag img-thumbnail"
                                                name={(favorite.data.government.country_name.isoCode ? favorite.data.government.country_name.isoCode : "_unknown") ? favorite.data.government.country_name.isoCode : `_${favorite.data.name}`}
                                                format="svg"
                                                pngSize={64}
                                                shiny={false}
                                                alt={`${favorite.data.name}'s Flag`}
                                                basePath="/img/flags"
                                            />
                                        </Link>
                                            <FontAwesomeIcon className="align-self-center" onClick={() => deleteFavorite(favorite.id)} icon={faTrashAlt} size="2x" color="darkred" />
                                        </div>
                                    </li>
                                ) : <h5>You have no favorites saved</h5> }
                            </ul>
                            </Collapse>)
                        }
                    </div>
                    <div className="col-sm-12 col-lg-5 card datacard mx-auto my-1">
                    <h5 className="list-group-item d-flex align-items-center" onClick={() => props.handleData("scores")}>
                        Scores 
                        <Badge variant="primary">
                            {loadingState ? 
                            <FontAwesomeIcon icon={faSpinner} spin /> : scores && scores.data.length>0 && scores.data.length}
                        </Badge>
                            {scores && <FontAwesomeIcon className="align-text-top" icon={props.scores ? faAngleDown : faAngleUp} />}
                        
                        </h5>
                        {loadingState ? null : 
                            (scores && 
                            <Collapse in={props.scores}>
                            <ul className="list-group list-group-flush">
                                {scores && scores.data.length>0 ?scores.data.map(score => {
                                    let milliseconds = score.data.dateCreated.seconds * 1000;
                                    let currentDate = new Date(milliseconds);
                                    let dateTime = currentDate.toGMTString();
                                    return <li className="list-group-item" key={score.id}>
                                        <div className="d-flex justify-content-between">
                                            <div className="d-flex flex-column">
                                                <h6><strong>{dateTime}</strong></h6>
                                                {score.data.gameMode && <h6>Mode - {score.data.gameMode}</h6>}
                                                {score.data.score && <h6>Score - {score.data.score}</h6>}
                                                <h6>Correct - {score.data.correct}</h6>
                                                <h6>Incorrect - {score.data.incorrect}</h6>
                                            </div>
                                            <FontAwesomeIcon className="align-self-center" onClick={() => deleteScore(score.id)} icon={faTrashAlt} size="2x" color="darkred" />
                                        </div>
                                        
                                    </li>
                                }): <h5>You have no scores saved</h5>}
                            </ul>
                            </Collapse>)
                        }
                    </div>
                </div>
            </div>
        )
}

export default Account;