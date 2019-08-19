import React from 'react';
import {db} from './Firebase/firebase';
import Flag from 'react-flags'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Alert } from 'react-bootstrap'

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
                    id: doc.data().dateCreated,
                    data: doc.data()
                }
                data.push(info);
            })
            this.setState({scores: data, loading: false})
        })
    }

    render(){
        return(

            <div className="col-8 mx-auto">
                {<Alert show={this.state.show} variant={this.state.message.style}>{this.state.message.content}</Alert>}
                <div className="card mb-3">
                    <div className="row">
                        <div className="col-2">
                            <img className="avatar" src={this.props.user ? (this.props.user.photoURL ? this.props.user.photoURL : require('../img/user.png')) : require('../img/user.png')} alt=""/>
                        </div>
                        <div className="col-6">
                            <h3>{this.props.user.displayName} </h3>
                            <h5>Account created {new Date(this.props.user.metadata.creationTime).toLocaleDateString()}</h5>
                            <h5>{this.props.user.email}</h5>
                            <h6>{this.props.user.phoneNumber ? this.props.user.phoneNumber : "No phone number added"}</h6>
                        </div>
                        <div className="col-4">
                            {this.state.loading ? <FontAwesomeIcon icon={faSpinner} spin size="3x"/> :
                            (
                            <>
                            <h2>Stats</h2>
                            <h5>{this.state.favorites && this.state.favorites.length} {this.state.favorites && this.state.favorites.length === 1 ? "Favorite" : "Favorites"}</h5>
                            <h5>{this.state.scores && this.state.scores.length} Scores</h5>
                            </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <h2>Favorites</h2>
                    <ul className="list-group list-group-flush">
                    {this.state.loading && <FontAwesomeIcon icon={faSpinner} spin />}
                        {this.state.favorites && this.state.favorites.length > 0 ? 
                            this.state.favorites.map(favorite =>
                            <li className="list-group-item" key={favorite.id}>
                                <h3>{favorite.id}</h3>
                                <h4>{favorite.data.government.capital.name}</h4>
                                <Flag
                                    className="detailFlag align-self-end text-right img-thumbnail"
                                    name={(favorite.data.government.country_name.isoCode ? favorite.data.government.country_name.isoCode : "_unknown") ? favorite.data.government.country_name.isoCode : `_${favorite.data.name}`}
                                    format="svg"
                                    pngSize={64}
                                    shiny={false}
                                    alt={`${favorite.data.name}'s Flag`}
                                    basePath="/img/flags"
                                    />
                                <FontAwesomeIcon onClick={() => this.deleteFavorite(favorite.id)} icon={faTrashAlt} size="2x" color="red" />
                            </li>
                        ) : <h5>You have no favorites saved</h5> }
                        </ul>
                    </div>
                    <div className="col">
                        <h2>Scores</h2>
                    <ul className="list-group list-group-flush">
                    {this.state.loading && <FontAwesomeIcon icon={faSpinner} spin />}
                        {this.state.scores && this.state.scores.map(score => {
                            let milliseconds = score.data.dateCreated.seconds * 1000;
                            let currentDate = new Date(milliseconds);
                            let dateTime = currentDate.toGMTString();
                            return <li className="list-group-item" key={score.id}>
                                <h4>{dateTime}</h4>
                                <h5>Mode - {score.data.gameMode}</h5>
                                <h5>Score - {score.data.score}</h5>
                                <h5>Correct - {score.data.correct}</h5>
                                <h5>Incorrect - {score.data.incorrect}</h5>
                            </li>
                        })}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Account;