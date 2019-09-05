import React from 'react';
import { db } from './Firebase/firebase';
import Flag from 'react-flags'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTrashAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
class Account extends React.Component {
    state = {
        message: ''
    }
    componentDidMount = () => {
        this.setState({loading: true }, this.getFavoritesData());
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
                console.log(info)
            })
            this.setState({favorites: data, loading: false})
        })
    }
    getScoresData = () => {
        let scoresRef = db.collection(`/users/${this.props.user.uid}/scores`);
        scoresRef.get().then(querySnapshot => {
            let data = [];
            querySnapshot.forEach( doc => {
                let info = {
                    id: doc.id,
                    data: doc.data()
                }
                data.push(info);
                console.log(info);
            })
            this.setState({scores: data, loading: false})
        })
    }

    render(){
        return(

            <div className="col-12 mx-auto">
                {<Alert show={this.state.show} variant={this.state.message.style}>{this.state.message.content}</Alert>}
                <div className="card mb-3">
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
                            <p>{this.state.favorites && this.state.favorites.length} {this.state.favorites && this.state.favorites.length === 1 ? "Favorite" : "Favorites"}</p>
                            <p>{this.state.scores && this.state.scores.length} Scores</p>
                            </>
                            )}
                        </div>
                        <Link 
                                className="btn btn-block btn-success" 
                                to={`${process.env.PUBLIC_URL}/account/edit`}>
                                <FontAwesomeIcon className="acctedit" icon={faPencilAlt}/>Edit Account
                            </Link>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <h5>Favorites - {this.state.loading ? <FontAwesomeIcon icon={faSpinner} spin /> : this.state.favorites && this.state.favorites.length>0 && this.state.favorites.length}</h5>
                        {this.state.loading ? null : 
                            (<ul className="list-group list-group-flush">
                                {this.state.favorites && this.state.favorites.length > 0 ? 
                                    this.state.favorites.map(favorite =>
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
                            </ul>)
                        }
                    </div>
                    <br/>
                    <div className="col-12">
                        <h5>Scores - {this.state.loading ? <FontAwesomeIcon icon={faSpinner} spin /> : this.state.scores && this.state.scores.length>0 && this.state.scores.length}</h5>
                        {this.state.loading ? null : 
                        (
                            <ul className="list-group list-group-flush">
                                {this.state.scores && this.state.scores.map(score => {
                                    let milliseconds = score.data.dateCreated.seconds * 1000;
                                    let currentDate = new Date(milliseconds);
                                    let dateTime = currentDate.toGMTString();
                                    return <li className="list-group-item" key={score.id}>
                                        <h4>{dateTime}</h4>
                                        {score.data.gameMode && <h5>Mode - {score.data.gameMode}</h5>}
                                        <h5>Score - {score.data.score}</h5>
                                        <h5>Correct - {score.data.correct}</h5>
                                        <h5>Incorrect - {score.data.incorrect}</h5>
                                        <FontAwesomeIcon className="align-self-center" onClick={() => this.deleteScore(score.id)} icon={faTrashAlt} size="2x" color="darkred" />
                                    </li>
                                })}
                            </ul>)
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Account;