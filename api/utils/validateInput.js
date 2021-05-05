module.exports = (email, password, confirmPassword) => {
  const errors = {};
  email = email.trim();
  const isRegisterValidaton = !!confirmPassword;

  if (email.trim() === '') {
    errors.email = 'Email must not be empty';
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = 'Email not valid';
    }
  }

  if (password === '') {
    errors.password = 'Pasword must not be empty';
  } else if (isRegisterValidaton && password.length < 6) {
    errors.password = 'Pasword must have 6 or more characters';
  }

  if (confirmPassword !== false && password !== confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
