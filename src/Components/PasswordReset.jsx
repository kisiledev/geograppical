import React from "react";
import firebase, { auth, googleProvider } from "./Firebase/firebase";
import { Alert } from 'react-bootstrap'
// import {StyledFirebaseAuth} from 'react-firebaseui';
import {Link, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

class PasswordReset extends React.Component {
  state = {
    email: '',
    password: '',
    message: '',
    methods: [],
    loading: true
  }

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
  componentDidMount = () => {
    setTimeout(() => {
      this.setState({loading: false})
    }, 1000)
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  login(e) {
    console.log(this.state)
    console.log('reunning login')
    e.preventDefault();
    auth.fetchSignInMethodsForEmail(this.state.email).then((u) => {
      console.log(u)
      this.setState({methods: u})
      if(u.length === 0){
        console.log('no methods')
        auth.signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
          console.log(u)
          this.setState({message: {style: "success", content: `Logged in user ${u.user.email}`}})
      }).catch((error) => {
          console.log(error);
          console.log(error.message)
          this.setState({message: {style: "danger", content: `${error.message} Sign up using the link below`}})
        });
      } else {
        console.log('methods found')
        const content = 
        `You already have an account at ${u[0]} 
        Please login using this authentication method`
        console.log(content)
        this.setState({message: {style: 'warning', content: content}})
      }
    })
    .catch((error) => {
        console.log(error);
        console.log(error.message)
        this.setState({message: {style: "danger", content: `${error.message}`}})
      });
  }

  signup(e){
    console.log(this.state)
    console.log('reunning signup')
    e.preventDefault();
    auth.createUserWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
        this.setState({message: {style: "success", content: `Created user ${u.user.email}`}})
    }).catch((error) => {
        this.setState({message: {style: "danger", content: `${error.message}`}})
      })
  }
  reset = (e, email ) => {
      auth.sendPasswordResetEmail(email)
      .then((u) => {
        this.setState({message: {style: "success", content: `Password Reset Link sent to: ${email}`}})
    }).catch((error) => {
        console.log(error)
        this.setState({message: {style: "danger", content: `${error.message}`}})
      })
  }

  googleSignUp = () => {
    auth.signInWithPopup(googleProvider).then((result) =>{
      console.log(result)
    }).catch((error) => {
      console.error(error);
      const credential = error.credential;
      console.log(credential);
    })
  };
  

  render() {
    // googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    
    const { user } = this.props;
    if(user && user.uid){
      return <Redirect to="/account" />
    } 
    return (
      this.state.loading ? 
      <div className="mx-auto col-lg-4 text-center">
        <FontAwesomeIcon icon={faSpinner} spin size="3x"/>
      </div>
       : 
      <div className="mx-auto col-lg-4">
        {<Alert variant={this.state.message.style}>{this.state.message.content}</Alert>}
        <div className="row mb-3">
          <div className="col-lg-12 text-center">
            <h1 className="mt-3">Reset Password</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
          {/* <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={auth} /> */}
            <form>
            <div className="form-group col-12 mx-auto">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input value={this.state.email} onChange={(e) =>this.handleChange(e)} type="email" name="email" className="form-control prefinput" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
              </div>
              <div className="col-12 d-flex justify-content-center mb-3">
              <button onClick={(e) => this.reset(e, this.state.email)} type="button" className="btn-primary email-button">
                  <span className="email-button__icon">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/mail.svg" className="emailicon" alt="email icon"/>
                  </span>
                  <span className="email-button__text">Reset Password</span>
                </button>
              </div>
              <div class="col-12 d-flex justify-content-center">
                <p>Don't have an account? <Link to={`${process.env.PUBLIC_URL}/signup`}>Sign Up</Link></p>
              </div>
              <div class="col-12 d-flex justify-content-center">
                <p>Already have an account? <Link to={`${process.env.PUBLIC_URL}/login`}>Sign In</Link></p>
              </div>
              </form>
          </div>
        </div>
      </div>
    );
  }
}

export default PasswordReset;