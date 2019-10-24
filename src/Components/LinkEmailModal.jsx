import React, { useState, useEffect } from 'react';
import useSignUpForm from '../Helpers/CustomHooks';
import * as Firebase from 'firebase/app';
import { auth } from './Firebase/firebase';
import 'firebaseui';
import { Link, Redirect } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert'


const LinkEmailModal = props => {
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isPWValid, setIsPWValid] = useState(false)

  const linkEmail = () => {
    const credential = Firebase.auth.EmailAuthProvider.credential(inputs.email, inputs.passwordOne);
    auth.currentUser.linkWithCredential(credential)
    .then((usercred) => {
        let user = usercred.user
        // setModalMessage({style: "success", content: "Linked email credentials to account"})
        console.log('success', user);
    }).catch((error) => {
        console.log(error)
        // setModalMessage({style: "danger", content: error.message})
    })
}

  const { inputs, handleInputChange, handleSubmit } = useSignUpForm(linkEmail);
  console.log('new links')
  console.log(inputs.email)
  useEffect(() => {
    console.log('checking email')
    checkEmail(inputs.email);
  }, [inputs.email])

  useEffect(() => {
    console.log('checking password')
    checkPWValue(inputs.passwordOne);
  }, [inputs.passwordOne])
  
  const checkEmail = (value) => {
      const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      const isEmailValid = regex.test(value)
      console.log(isEmailValid)
      setIsEmailValid(isEmailValid)
  }
  const checkPWValue = (value) => {
      const re2 = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;
      const isPWValid = !re2.test(value)
      console.log(isPWValid)
      setIsPWValid(isPWValid)
  }
    
  
      
  const { user } = props;
  if(user && user.uid){
    return <Redirect to="/account" />
  } 
  
  const isInvalid = 
  inputs.passwordOne !== inputs.passwordTwo ||
  inputs.passwordOne === '' || 
  inputs.email === '' ||
  inputs.username === '';

  return (
    <div className="mx-auto text-center col-lg-12">
        {<Alert className="mt-3" show={props.show} variant={props.message.style}>{props.message.content}</Alert>}
        <div className="row mb-3">
            <div className="col-lg-12 text-center">
            <h1 className="mt-2">Link Email</h1>
            </div>
        </div>
        <div className="row">
            <div className="col-lg-12">
                <form onSubmit={handleSubmit}>
                <div className="form-group col-12 mb-4 mx-auto">
                    <input 
                    value={inputs.username || ""} 
                    onChange={handleInputChange}
                    type="text" 
                    name="username" 
                    className="form-control prefinput" 
                    placeholder="Full Name" 
                    />
                </div>
                <div className="form-group col-12 mb-4 mx-auto">
                    <input 
                    value={inputs.email || ""} 
                    onChange={handleInputChange}
                    type="email" 
                    name="email" 
                    className={"form-control " + ((inputs.email === "" || !inputs.email ) ? 'prefinput' : (isEmailValid ? 'form-success' : 'form-error'))}
                    placeholder="Enter email" 
                    />
                </div>
                <div className="form-group col-12 mb-4 mx-auto">
                    <input 
                    value={inputs.passwordOne || ""} 
                    onChange={handleInputChange}
                    type="password" 
                    name="passwordOne" 
                    className={"form-control " + ((inputs.passwordOne === "" || !inputs.passwordOne) ? 'prefinput' : (isPWValid ? 'form-success' : 'form-error'))}
                    placeholder="Password" 
                    />
                </div>
                <div className="form-group col-12 mb-4 mx-auto">
                    <input 
                    value={inputs.passwordTwo || ""} 
                    onChange={handleInputChange}
                    type="password" 
                    name="passwordTwo" 
                    className={"form-control " + ((inputs.passwordTwo === "" || !inputs.passwordTwo) ? 'prefinput' : (inputs.passwordTwo === inputs.passwordOne ? 'form-success' : 'form-error'))}
                    placeholder="Confirm Password" 
                    />
                </div>
                    <div className="mx-auto form-group">
                        <button disabled={isInvalid} type="submit" className="provider-button email-button">
                            <span className="email-button__icon">
                                <img src={require('../img/auth_service_email.svg')} className="emailicon" alt="email icon" />
                            </span>
                            <span className="google-button__text">Link with Email</span>
                        </button>
                    </div>
                    <div className="mx-auto form-group">
                        <button disabled={isInvalid} onClick={() => props.close()} type="button" className="provider-button">
                            <span className="google-button__text">{props.message.style && props.message.style === "success" ? "Close" : "Cancel"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
);
}

const SignUpLink = () => (
  <div className="col-12 d-flex justify-content-center">
    <p>Already have an account? <Link to={`${process.env.PUBLIC_URL}/login`}>Sign In</Link></p>
  </div>
)
export default LinkEmailModal;
export { SignUpLink }
