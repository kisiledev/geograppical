import React from 'react';
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({
    component: Component,
    authenticated,
    ...rest
}) => {
    return (
        <Route 
            {...rest}
            render = { props => authenticated === true ? (
            <Component {...props} {...rest} />
            ) : (
                <Redirect to="/register" />
            )
        }
        />
    )
}
export default PrivateRoute;