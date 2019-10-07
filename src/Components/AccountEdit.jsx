import React, { useState, useEffect } from 'react';
import * as Firebase from 'firebase/app';
import { db, auth, googleProvider, facebookProvider, emailProvider, twitterProvider } from './Firebase/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowLeft, faTrashAlt  } from '@fortawesome/free-solid-svg-icons';
import { Alert, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import LinkEmailModal from './LinkEmailModal';

const AccountEdit = props => {
    const [providers, setProviders] = useState(props.user.providerData)
    const [message, setMessage] = useState('')
    const [favorites, setFavorites] = useState('')
    const [scores, setScores] = useState('')
    const [loadingState, setLoadingState] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const [show, setShow] = useState(false)

    useEffect (() => {
        setLoadingState(true)
        getFavoritesData();
        getScoresData();
    }, [])

    const unlink = (provider) => {
        console.log(props.user.providerData)
        auth.currentUser.unlink(provider).then(() => {
            setMessage({style: "danger", content: `Unlinked provider ${provider}`})
            setProviders(props.user.providerData);
        }).catch((error) => {
            console.log(error)
        })
    }
    const close = () => {
        setShow(false);
        setProviders(props.user.providerData)
    }
    const linkEmail = (e, email, password) => {
        e.preventDefault();
        const credential = Firebase.auth.EmailAuthProvider.credential(email, password);
        auth.currentUser.linkWithCredential(credential)
        .then((usercred) => {
            let user = usercred.user
            setModalMessage({style: "success", content: "Linked email credentials to account"})
            console.log('success', user);
        }).catch((error) => {
            console.log(error)
            setModalMessage({style: "danger", content: error.message})
        })
    }
    const providerLink = (provider) => {
        auth.currentUser.linkWithPopup(provider).then((result) =>{
          const credential = result.credential;
          const user = result.user;
          setProviders(props.user.providerData)
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
                console.log(providers)
            }
        }).catch((error) => {
          console.error(error);
          const credential = error.credential;
          console.log(credential);
        })
      };
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
            })
            setFavorites(data)
            setLoadingState(false)
        })
    }
    const getScoresData = () => {
        let scoresRef = db.collection(`/users/${props.user.uid}/scores`);
        scoresRef.get().then(querySnapshot => {
            let data = [];
            querySnapshot.forEach( doc => {
                let info = {
                    id: doc.data().dateCreated,
                    data: doc.data()
                }
                data.push(info);
            })
            setScores(data)
            setLoadingState(false)
        })
    }
        let providersArray = [
            {
                id: 1,
                name: "Google", 
                source: googleProvider,
                provName: 'google.com',
                icon: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg',
                onClick: () => providerLink(googleProvider)
                
            }, 
            {
                id: 2,
                name: "Facebook", 
                source: facebookProvider,
                provName: 'facebook.com',
                icon: require('../img/facebook-icon-white.svg'),
                onClick: () => providerLink(facebookProvider)
            }, 
            {
                id: 3, 
                name: 'Twitter',
                source: twitterProvider,
                provName: 'twitter.com',
                icon: require('../img/Twitter_Logo_WhiteOnBlue.svg'),
                onClick: () => providerLink(twitterProvider)
            },
            {
                id: 4,
                name: "Email", 
                source: emailProvider,
                provName: 'password',
                icon: require('../img/auth_service_email.svg'),
                onClick: () => setShow(true)
                
            }
        ]
        let userProvs =[];
            providers && providers.map(data =>{
                return userProvs.push(data.providerId)
            });
        let provIcons = [];
        providersArray.map(prov => {
            let provider = {};
            provider["name"] = prov.provName;
            provider["icon"] = prov.icon;
            return provIcons.push(provider)
        })
        return(
            <>
            <Modal show={show} onHide={() => this.handleClose()}>
                <LinkEmailModal linkEmail={linkEmail} close={close} message={modalMessage}/>
                
            </Modal>
            <div className="col-sm-12 col-md-6 mx-auto">
                {<Alert show={show} variant={message.style}>{message.content}</Alert>}
                <div className="card col-lg-8 col-xl-8 mx-auto ">
                    <div className="row">
                        <div className="col-12 text-center d-flex align-items-center justify-content-center flex-column">
                            <img className="avatar img-fluid" src={props.user ? (props.user.photoURL ? props.user.photoURL : require('../img/user.png')) : require('../img/user.png')} alt=""/>

                            <div className="btn btn-link btn-file"> Edit avatar 
                            <input type="file" id="upload-img" />
                            </div>
                        </div>
                        <div className="col-12 text-center">
                            <h5 className="mt-3">{props.user.displayName} </h5>
                            <p>Account created {new Date(props.user.metadata.creationTime).toLocaleDateString()}</p>
                            <p>{props.user.email}</p>
                            <p>{props.user.phoneNumber ? props.user.phoneNumber : <Link to={'#'}>Add Phone</Link>}</p>
                            {loadingState ? <FontAwesomeIcon className="my-5" icon={faSpinner} spin size="2x"/> :
                            (
                            <>
                            <h6>Stats</h6>
                            <p>{favorites && favorites.length} {favorites && favorites.length === 1 ? "Favorite" : "Favorites"}</p>
                            <p>{scores && scores.length} Scores</p>
                            </>
                            )}
                        </div>
                        <div className="col-12 text-center">
                            <Link 
                                className="btn btn-primary" 
                                to={`${process.env.PUBLIC_URL}/account`}>
                                <FontAwesomeIcon className="acctedit" icon={faArrowLeft}/>Back to Account
                            </Link>
                        </div>
                    </div>
                </div>
                    <h3 className="mt-5">Account Credentials</h3>
                    <div className="d-flex">
                    {providers && providers.map((data) => {
                        return (
                        <div key={data.uid}className="card mb-3">
                            {providersArray.map(prov => {
                                if(data.providerId === prov.provName){
                                    return <img src={prov.icon} key={prov.id} className="mb-3 providericon" alt={`${prov.name.toLowerCase()} icon`} />
                                }
                                return null;

                            })}
                            
                            <div className="d-flex justify-content-between">
                                <div className="align-items-start">
                                    <p><strong>Name </strong> - {data.displayName}</p>
                                    {data.email && <p><strong>Email </strong> - {data.email}</p>}
                                    {providersArray.map(prov => {
                                        if(data.providerId === prov.provName){
                                            return <p key={prov.id}><strong>Provider </strong> - {prov.name}</p>
                                        }
                                        return null;
                                })}
                                </div>
                                <button onClick={() => unlink(data.providerId)} className="align-self-end btn btn-sm btn-danger">
                                    Unlink
                                    <FontAwesomeIcon className="align-self-center ml-1" icon={faTrashAlt}
                                     color="white" />
                                </button>
                            </div>
                        </div>
                        )
                    })}
                    </div>
                    {providersArray.map(provider => {
                        if(!userProvs.includes(provider.provName)){
                            return <div key={provider.id} className="col-12 d-flex w-100 justify-content-center mb-3">
                        <button onClick={provider.onClick} type="button" className={`provider-button ${provider.name.toLowerCase()}-button`}>
                        <span className={`${provider.name.toLowerCase()}-button__icon`}>
                            <img src={provider.icon} className={`${provider.name.toLowerCase()}icon`} alt="google icon" />
                        </span>
                        <span className="google-button__text">Link with {provider.name}</span>
                        </button>
                    </div>
                        }
                        return null;
                    })}
            </div>
            </>
        )
    }

export default AccountEdit;