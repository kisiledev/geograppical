import React from 'react';
import { db, auth, googleProvider, facebookProvider, emailProvider, twitterProvider } from './Firebase/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowLeft, faTrashAlt  } from '@fortawesome/free-solid-svg-icons';
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
class AccountEdit extends React.Component {
    state = {
        message: ''
    }
    componentDidMount = () => {
        console.log('reloading edit page')
        console.log(googleProvider, facebookProvider)
        console.log(this.props.user.providerData)
        this.setState({loading: true }, this.getFavoritesData());
        this.setState({loading: true }, this.getScoresData());
    }
    unlink = (provider) => {
        auth.currentUser.unlink(provider).then(() => {
            console.log('provider unlinked')
            this.setState({message: {style: "danger", content: `Unlinked provider ${provider} to favorites`}});
        }).catch((error) => {
            console.log(error)
        })
    }
    providerLink = (provider) => {
        auth.currentUser.linkWithPopup(provider).then((result) =>{
          const credential = result.credential;
          const user = result.user
          console.log(credential, user)
        }).catch((error) => {
          console.error(error);
          const credential = error.credential;
          console.log(credential);
        })
        auth.getRedirectResult().then((result) => {
            if(result.credential){
                const credential = result.credential;
                const user = result.user
                console.log(credential, user)
            }
        }).catch((error) => {
          console.error(error);
          const credential = error.credential;
          console.log(credential);
        })
      };
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
        let providers = [
            {
                id: 1,
                name: "Google", 
                source: googleProvider,
                provName: 'google.com',
                icon: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
                
            }, 
            {
                id: 2,
                name: "Facebook", 
                source: facebookProvider,
                provName: 'facebook.com',
                icon: 'https://www.gstatic.com/mobilesdk/160409_mobilesdk/images/auth_service_facebook.svg'
            }, 
            {
                id: 3,
                name: "Email", 
                source: emailProvider,
                provName: 'password',
                icon: 'https://www.gstatic.com/mobilesdk/160409_mobilesdk/images/auth_service_email.svg'
            },
            {
                id: 4, 
                name: 'Twitter',
                source: twitterProvider,
                provName: 'twitter.com',
                icon: 'https://www.gstatic.com/mobilesdk/160409_mobilesdk/images/auth_service_twitter.svg'
            }
        ]
        let userProvs =[];
        if(this.props.user.providerData){
            this.props.user.providerData.map(data =>{
                return userProvs.push(data.providerId)
            });
        }
        let provIcons = [];
        providers.map(prov => {
            let provider = {};
            provider["name"] = prov.provName;
            provider["icon"] = prov.icon;
            return provIcons.push(provider)
        })
        return(
            
            <div className="col-12 mx-auto">
                {<Alert show={this.state.show} variant={this.state.message.style}>{this.state.message.content}</Alert>}
                <div className="card mb-3">
                    <div className="row">
                        <div className="col-12 text-center d-flex align-items-center justify-content-center flex-column">
                            <img className="avatar img-fluid" src={this.props.user ? (this.props.user.photoURL ? this.props.user.photoURL : require('../img/user.png')) : require('../img/user.png')} alt=""/>

                            <div className="btn btn-link btn-file"> Edit avatar 
                            <input type="file" id="upload-img" />
                            </div>
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
                                className="btn btn-block btn-primary" 
                                to={`${process.env.PUBLIC_URL}/account`}>
                                <FontAwesomeIcon className="acctedit" icon={faArrowLeft}/>Back to Account
                            </Link>
                    </div>
                </div>
                    <h3 className="mt-5">Account Credentials</h3>   
                    {this.props.user.providerData && this.props.user.providerData.map((data) => {
                        return <div key={data.email}className="card mb-3">
                            <p><strong>Name </strong>{data.displayName}</p>
                            <p><strong>Email </strong>{data.email}</p>
                            {providers.map(prov => {
                                if(data.providerId === prov.provName){
                                    return <p><strong>Provider </strong><img src={prov.icon} className="emailicon" alt="google icon" />{prov.name}</p>
                                }

                            })}
                            <button className="align-self-end btn btn-sm btn-danger">
                                Unlink Provider
                                <FontAwesomeIcon className="align-self-center ml-1" onClick={() => this.unlink(data.providerId)} icon={faTrashAlt}
                                 color="darkred" />
                            </button>
                    </div>
                    })}
                    {providers.map(provider => {
                        if(!userProvs.includes(provider.provName)){
                            return <div key={provider.id} className="col-12 d-flex w-100 justify-content-center mb-3">
                        <button onClick={() => this.providerLink(provider.source)} type="button" className="provider-button">
                        <span className="google-button__icon">
                            <img src={provider.icon} className="emailicon" alt="google icon" />
                        </span>
                        <span className="google-button__text">Link with {provider.name}</span>
                        </button>
                    </div>
                        }
                    })}
            </div>
        )
    }
}

export default AccountEdit;