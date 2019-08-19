import React, { Component } from 'react';
import 'firebaseui';
import { auth } from './Firebase/firebase';
import { Link, Redirect } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert'

class SignUp extends Component {
    state = {
        email: '',
        password: '',
        message: ''
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
      }
    
      login(e) {
        console.log(this.state)
        console.log('reunning login')
        e.preventDefault();
        auth.signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
            console.log(u)
            this.setState({message: {style: "success", content: `Logged in user ${u.user.email}`}})
        }).catch((error) => {
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
      render() {
        // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        
        const { user } = this.props;
        if(user && user.uid){
          return <Redirect to="/account" />
        } 
        return (
          
          <div className="mx-auto col-lg-4">
            {<Alert variant={this.state.message.style}>{this.state.message.content}</Alert>}
            <div className="row mb-5">
              <div className="col-lg-12 text-center">
                <h1 className="mt-5">Sign Up</h1>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
              {/* <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={auth} /> */}
                <form>
                <div className="form-group col-6 mx-auto">
                  <label htmlFor="exampleInputEmail1">Email address</label>
                  <input value={this.state.email} onChange={(e) =>this.handleChange(e)} type="email" name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                  </div>
                  <div className="form-group col-6 mx-auto">
                  <label htmlFor="exampleInputPassword1">Password</label>
                  <input value={this.state.password} onChange={(e) => this.handleChange(e)} type="password" name="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                  </div>
                  <div className="col-12 d-flex justify-content-center mb-3">
                  <button onClick={(e) => this.signup(e)} type="button" className="btn-primary email-button">
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
    export default SignUp;
