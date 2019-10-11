import React, { useState } from 'react';

const useSignUpForm = (callback) => {
    const [inputs, setInputs] = useState({});
    const handleSubmit = (e) => {
        e && e.preventDefault();
        callback();
    }
    const handleInputChange = (e) => {
        e.persist();
        setInputs(inputs => ({...inputs, [e.target.name]: e.target.value}));
    }
    return {
        handleSubmit,
        handleInputChange,
        inputs
    };
}

export default useSignUpForm;