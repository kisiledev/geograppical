import React, { Component } from 'react';
import 'firebaseui';
import { auth, provider } from './Firebase/firebase';
import Alert from 'react-bootstrap/Alert'

class SignIn extends Component {
    state = {
        email: '',
        password: ''
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
            this.setState({message: {style: "danger", content: `${error.messasge}`}}, console.log(error.message))
          })
      }
      render() {
        return (
            <div>
            {this.state.messasge && console.log(this.state.message) && <Alert variant={this.state.message.style}>{this.state.message}</Alert>}
           <div className="col-md-4 mx-auto">
           <form>
          <div className="form-group">
           <label htmlFor="exampleInputEmail1">Email address</label>
           <input value={this.state.email} onChange={(e) =>this.handleChange(e)} type="email" name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
           <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
           <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input value={this.state.password} onChange={(e) => this.handleChange(e)} type="password" name="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
          </div>
          <button type="submit" onClick={(e) => this.login(e)} className="btn btn-primary">Login</button>
          <button onClick={(e) => this.signup(e)} style={{marginLeft: '25px'}} className="btn btn-success">Signup</button>
     </form>
     
     </div>
     </div>
        );
      }
    }
    export default SignIn;
