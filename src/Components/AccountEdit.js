import React from 'react';
import { db } from './Firebase/firebase';
import Flag from 'react-flags'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTrashAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
class AccountEdit extends React.Component {
    state = {
        message: ''
    }
    componentDidMount = () => {
        console.log(this.props.user.providerData)
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
            <div className="col-12 mx-auto">
                {<Alert show={this.state.show} variant={this.state.message.style}>{this.state.message.content}</Alert>}
                <div className="card mb-3">
                    <div className="row">
                        <div className="col-12 text-center">
                            <img className="avatar img-fluid" src={this.props.user ? (this.props.user.photoURL ? this.props.user.photoURL : require('../img/user.png')) : require('../img/user.png')} alt=""/>

                            <span class="btn btn-link btn-file"> Edit avatar 
                            <input type="file" id="upload-img" />
                            </span>
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
                    <h3>User Details</h3>   
                    {this.props.user.providerData.map((data) => {
                        return <div className="card mb-3"><p><strong>Name </strong>{data.displayName}</p>
                        <p><strong>Email </strong>{data.email}</p>
                    <p><strong>Provider </strong>{data.providerId === "google.com" && <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="emailicon" alt="google icon" />} {data.providerId} </p>
                    </div>
                    })}
                    <p>{this.props.user.uid}</p>
            </div>
        )
    }
}

export default AccountEdit;