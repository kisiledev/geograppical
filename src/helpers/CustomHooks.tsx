 
 
 
import React, { useState } from 'react';

interface Inputs {
  email: string;
  passwordOne: string;
  passwordTwo: string;
  username: string;
  password: string;
}

interface UseSignUpFormReturn {
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputs: Inputs;
}

const useSignUpForm = (callback: () => void): UseSignUpFormReturn => {
  const [inputs, setInputs] = useState<Inputs>({
    email: '',
    passwordOne: '',
    passwordTwo: '',
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
    }
    callback();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setInputs((inputs) => ({ ...inputs, [e.target.name]: e.target.value }));
  };

  return {
    handleSubmit,
    handleInputChange,
    inputs
  };
};

export default useSignUpForm;
