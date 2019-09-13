import React, { Component } from 'react';
import 'firebaseui';
import { Redirect } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert'


class LinkEmailModal extends Component {
    state = {
      username: '',
      email: '',
      password: '',
      message: '',
      passwordOne: '',
      passwordTwo: ''
    }
    handleChange(e) {
        e.persist();
        this.setState({ [e.target.name]: e.target.value}, () => {
            this.checkValue(this.state.passwordOne);
            console.log(this.state.isInvalid)
        });
    }
    checkValue(value){
        const re2 = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;
        const isInvalid = re2.test(value)
        let status = 'failure';
        isInvalid ? status = 'fails' : status = 'passes'
        this.setState({isInvalid})
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
        
        
        const isFormInvalid = 
        passwordOne !== passwordTwo ||
        passwordOne === '' || 
        email === '' ||
        username === '';

        
        return (
            <div className="mx-auto text-center col-lg-4">
                {<Alert className="mt-3" show={this.props.show} variant={this.props.message.style}>{this.props.message.content}</Alert>}
                <div className="row mb-3">
                    <div className="col-lg-12 text-center">
                    <h1 className="mt-2">Link Email</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <form onSubmit={(e) => this.props.linkEmail(e, email, passwordOne)}>
                            <div className="form-group col-12 mb-4 mx-auto">
                                <input 
                                value={email} 
                                onChange={(e) =>this.handleChange(e)} 
                                type="email" 
                                name="email" 
                                className={"form-control "  + (this.state.email === "" ? 'prefinput' : (this.state.isInvalid ? 'form-error' : 'form-success'))}
                                placeholder="Enter email" 
                                />
                            </div>
                            <div className="form-group col-12 mb-4 mx-auto">
                                <input 
                                value={passwordOne} 
                                onChange={(e) => this.handleChange(e)} 
                                type="password" 
                                name="passwordOne" 
                                className={"form-control " + (this.state.passwordOne === "" ? 'prefinput' : (this.state.isInvalid ? 'form-error' : 'form-success'))}
                                placeholder="Password" 
                                />
                            </div>
                            <div className="form-group col-12 mb-4 mx-auto">
                                <input 
                                value={passwordTwo} 
                                onChange={(e) => this.handleChange(e)} 
                                type="password" 
                                name="passwordTwo" 
                                className={"form-control " + (this.state.passwordOne === "" ? 'prefinput' : (this.state.isInvalid ? 'form-error' : 'form-success'))}
                                placeholder="Confirm Password" 
                                />
                            </div>
                            <div className="mx-auto form-group">
                                <button type="submit" className="provider-button email-button">
                                    <span className="email-button__icon">
                                        <img src={require('../img/auth_service_email.svg')} className="emailicon" alt="email icon" />
                                    </span>
                                    <span className="google-button__text">Link with Email</span>
                                </button>
                            </div>
                            <div className="mx-auto form-group">
                                <button onClick={() => this.props.close()} type="button" className="provider-button">
                                    <span className="google-button__text">{this.props.message.style && this.props.message.style === "success" ? "Close" : "Cancel"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default LinkEmailModal;
