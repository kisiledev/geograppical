import React from "react";
import { auth } from "./Firebase/firebase";
import firebase from './Firebase/firebase'
import {StyledFirebaseAuth} from 'react-firebaseui'
import {Redirect } from 'react-router-dom';

class Register extends React.Component {
  uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        console.log('signInSuccessWithAuthResult', authResult, redirectUrl)
        this.props.history.push('/')
        return false
      }
    }
  }

  

  render() {
    const { user } = this.props;
    console.log(user)
    if(user && user.uid){
      console.log('loading user')
      return <Redirect to="/account" />
    } 
    console.log(auth);
    return (
      <div className="mx-auto col-lg-4">
        <div className="row mb-5">
          <div className="col-lg-12 text-center">
            <h1 className="mt-5">Register New Person</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={auth} />
          </div>
        </div>
      </div>
    );
  }
}

export default Register;