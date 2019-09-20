import React from 'react';
import { db } from './Firebase/firebase';
import Flag from 'react-flags'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faAngleUp, faAngleDown, faTrashAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Alert, Badge } from 'react-bootstrap'
import Collapse from 'react-bootstrap/Collapse';
import { Link } from 'react-router-dom'


class Account extends React.Component {
    state = {
        message: ''
    }
    componentDidMount = () => {
        this.setState({loading: true }, 
            this.getFavoritesData());
        this.setState({loading: true }, this.getScoresData());
    }
    deleteFavorite = (id) => {
        db.collection(`users/${this.props.user.uid}/favorites`).doc(id).delete()
        .then(() => {
          console.log(`Removed ${id} from favorites`)
          this.setState({message: {style: "warning", content: `Removed ${id} from favorites`}, favorite: false, show: true})
        }).catch((err) => {
          console.error(err)
          this.setState({message: {style: "danger", content: `Error adding ${id} to favorites, ${err}`}})
        })
    }
    deleteScore = (id) => {
        db.collection(`users/${this.props.user.uid}/scores`).doc(id).delete()
        .then(() => {
          console.log(`Removed ${id} from scores`)
          this.setState({message: {style: "warning", content: `Removed ${id} from scores`}, show: true})
        }).catch((err) => {
          console.error(err)
          this.setState({message: {style: "danger", content: `Error removing ${id} from scores, ${err}`}})
        })
    }
    getFavoritesData = () => {
        let countriesRef = db.collection(`/users/${this.props.user.uid}/favorites`);
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
            console.log(data);
            this.setState({favorites: {isOpen: false, data}, loading: false})
        })
    }
    getScoresData = () => {
        let scoresRef = db.collection(`/users/${this.props.user.uid}/scores`);
        scoresRef.onSnapshot((querySnapshot) => {
            let data = [];
            querySnapshot.forEach( doc => {
                let info = {
                    id: doc.id,
                    data: doc.data()
                }
                data.push(info);
                data["isOpen"] = true;
                console.log(data);
                console.log(info);
            })
            this.setState({scores: {isOpen: false, data}, loading: false})
        })
    }

    toggleValue = (source) => {
        let priorState = {...this.state[source]};
        priorState.isOpen = !this.state[source].isOpen;
        this.setState({[source]: priorState})
      }

    render(){
        return(

            <div className="col-sm-12 col-md-8 mx-auto">
                {<Alert show={this.state.show} variant={this.state.message.style}>{this.state.message.content}</Alert>}
                <div className="card col-lg-8 col-xl-6 mx-auto mb-3">
                    <div className="row">
                        <div className="col-12 text-center">
                            <img className="avatar img-fluid" src={this.props.user ? (this.props.user.photoURL ? this.props.user.photoURL : require('../img/user.png')) : require('../img/user.png')} alt=""/>
                            
                        </div>
                        <div className="col-12 text-center">
                            <h5 className="mt-3">{this.props.user.displayName} </h5>
                            <p>Account created {new Date(this.props.user.metadata.creationTime).toLocaleDateString()}</p>
                            <p>{this.props.user.email}</p>
                            <p>{this.props.user.phoneNumber ? this.props.user.phoneNumber : "No phone number added"}</p>
                            {this.state.loading ? <FontAwesomeIcon className="my-5" icon={faSpinner} spin size="2x"/> :
                            (
                            <>
                            <h6>Stats</h6>
                            <p>{this.state.favorites && this.state.favorites.data.length} {this.state.favorites && this.state.favorites.length === 1 ? "Favorite" : "Favorites"}</p>
                            <p>{this.state.scores && this.state.scores.data.length} Scores</p>
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
                        <h5 className="list-group-item d-flex align-items-center" onClick={() => this.toggleValue("favorites")}>
                            Favorites
                            <Badge variant="primary">
                                {this.state.loading ? 
                                <FontAwesomeIcon icon={faSpinner} spin /> : this.state.favorites && this.state.favorites.data.length>0 && this.state.favorites.data.length}
                            </Badge>
                                {this.state.favorites && <FontAwesomeIcon className="align-text-top" icon={this.state.favorites.isOpen ? faAngleDown : faAngleUp} />}
                        </h5>
                        {this.state.loading ? null : 
                            (
                            this.state.favorites &&
                            <Collapse in={this.state.favorites.isOpen}>
                            <ul className="list-group list-group-flush">
                                {this.state.favorites && this.state.favorites.data.length > 0 ? 
                                    this.state.favorites.data.map(favorite =>
                                    <li className="list-group-item" key={favorite.id}>
                                        <h5>{favorite.id} - <small>{favorite.data.government.capital.name.split(';')[0]}</small></h5>
                                        <div className="d-flex justify-content-between">
                                        <Link to={`${process.env.PUBLIC_URL}/${this.props.simplifyString(favorite.id)}`} >
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
                                            <FontAwesomeIcon className="align-self-center" onClick={() => this.deleteFavorite(favorite.id)} icon={faTrashAlt} size="2x" color="darkred" />
                                        </div>
                                    </li>
                                ) : <h5>You have no favorites saved</h5> }
                            </ul>
                            </Collapse>)
                        }
                    </div>
                    <div className="col-sm-12 col-lg-5 card datacard mx-auto my-1">
                    <h5 className="list-group-item d-flex align-items-center" onClick={() => this.toggleValue("scores")}>
                        Scores 
                        <Badge variant="primary">
                            {this.state.loading ? 
                            <FontAwesomeIcon icon={faSpinner} spin /> : this.state.scores && this.state.scores.data.length>0 && this.state.scores.data.length}
                        </Badge>
                            {this.state.scores && <FontAwesomeIcon className="align-text-top" icon={this.state.scores.isOpen ? faAngleDown : faAngleUp} />}
                        
                        </h5>
                        {this.state.loading ? null : 
                            (this.state.scores && 
                            <Collapse in={this.state.scores.isOpen}>
                            <ul className="list-group list-group-flush">
                                {this.state.scores && this.state.scores.data.length>0 ?this.state.scores.data.map(score => {
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
                                            <FontAwesomeIcon className="align-self-center" onClick={() => this.deleteScore(score.id)} icon={faTrashAlt} size="2x" color="darkred" />
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
}

export default Account;