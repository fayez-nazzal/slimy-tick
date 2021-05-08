import { useState } from 'react';

const useForm = ({ submitCallback, initialState }) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    submitCallback();
  };

  return {
    onChange,
    onSubmit,
    values,
    errors,
    setErrors,
  };
};

export default useForm;
