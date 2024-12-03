/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable linebreak-style */
import { useState } from 'react';

const useSignUpForm = (callback) => {
  const [inputs, setInputs] = useState({});
  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    callback();
  };
  const handleInputChange = (e) => {
    e.persist();
    setInputs((inputs) => ({ ...inputs, [e.target.name]: e.target.value }));
  };
  return {
    handleSubmit,
    handleInputChange,
    inputs,
  };
};

export default useSignUpForm;
