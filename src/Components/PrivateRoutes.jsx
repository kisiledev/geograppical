import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const PrivateRoute = ({
    component: Component,
    authenticated,
    loading,
    ...rest
}) => {
    if(loading){
        return <div className="mt-5 mx-auto text-center">
            <FontAwesomeIcon icon={faSpinner} spin size="2x"/>
        </div>
    }
    return (
        <Route 
            {...rest}
            render = { props => authenticated ? (
            <Component {...props} {...rest} />
            ) : (
                <Redirect to="/login" />
            )
        }
        />
    )  
}
export default PrivateRoute;