import React, { Component } from 'react';
import 'firebaseui';
import { auth, googleProvider } from './Firebase/firebase'
import { Link, Redirect } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert'


class SignUp extends Component {
    state = {
      username: '',
      email: '',
      password: '',
      message: '',
      passwordOne: '',
      passwordTwo: ''
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
      }
    
      login(e) {
        e.preventDefault();
        auth.signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
            this.setState({message: {style: "success", content: `Logged in user ${u.user.email}`}})
        }).catch((error) => {
            this.setState({message: {style: "danger", content: `${error.message}`}})
        });
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
    
      signup(e){
        e.preventDefault();
        auth.createUserWithEmailAndPassword(this.state.email, this.state.passwordOne)
          .then((u)=>{
            this.setState({message: {style: "success", content: `Created user ${u.user.email}`}})
        }).catch((error) => {
            this.setState({message: {style: "danger", content: `${error.message}`}})
          })
      }
      render() {
        const { user } = this.props;
        if(user && user.uid){
          return <Redirect to="/account" />
        } 
        const {
          username,
          message,
          email,
          passwordOne,
          passwordTwo
        } = this.state;
        
        const isInvalid = 
        passwordOne !== passwordTwo ||
        passwordOne === '' || 
        email === '' ||
        username === '';

        
        return (
          
          <div className="mx-auto col-lg-4">
            {<Alert variant={message.style}>{message.content}</Alert>}
            <div className="row mb-3">
              <div className="col-lg-12 text-center">
                <h1 className="mt-3">Sign Up</h1>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <form onSubmit={(e) => this.signup(e)}>
                <div className="form-group col-12 mb-4 mx-auto">
                  <input 
                    value={username} 
                    onChange={(e) =>this.handleChange(e)} 
                    type="text" 
                    name="username" 
                    className="form-control" 
                    placeholder="Full Name" 
                  />
                </div>
                <div className="form-group col-12 mb-4 mx-auto">
                  <input 
                    value={email} 
                    onChange={(e) =>this.handleChange(e)} 
                    type="email" 
                    name="email" 
                    className="form-control" 
                    placeholder="Enter email" 
                  />
                </div>
                <div className="form-group col-12 mb-4 mx-auto">
                  <input 
                    value={passwordOne} 
                    onChange={(e) => this.handleChange(e)} 
                    type="password" 
                    name="passwordOne" 
                    className="form-control" 
                    placeholder="Password" 
                  />
                </div>
                <div className="form-group col-12 mb-4 mx-auto">
                  <input 
                    value={passwordTwo} 
                    onChange={(e) => this.handleChange(e)} 
                    type="password" 
                    name="passwordTwo" 
                    className="form-control" 
                    placeholder="Confirm Password" 
                  />
                </div>
                  <div className="col-12 d-flex justify-content-center mb-3">
                  <button disabled={isInvalid} type="submit" className="btn-primary email-button">
                      <span className="email-button__icon">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/mail.svg" className="emailicon" alt="email icon"/>
                      </span>
                      <span className="email-button__text">Sign Up with Email</span>
                    </button>
                  </div>
                  <div className="col-12 d-flex justify-content-center mb-3">
                    <button onClick={(e) => this.googleSignUp(e)} type="button" className="google-button">
                      <span className="google-button__icon">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="emailicon" alt="google icon" />
                      </span>
                      <span className="google-button__text">Sign Up with Google</span>
                    </button>
                  </div>
                  </form>
                  <SignUpLink />
              </div>
            </div>
          </div>
        );
      }
}

const SignUpLink = () => (
  <div class="col-12 d-flex justify-content-center">
    <p>Already have an account? <Link to={`${process.env.PUBLIC_URL}/login`}>Sign In</Link></p>
  </div>
)
export default SignUp;
export { SignUpLink }
