import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { navigate } from 'gatsby';
import { REGISTER_USER } from '../apollo/queries';
import useForm from '../hooks/userForm';
import FormPageContainer from '../components/form/FormPageContainer';
import ErrorTypography from '../components/general/ErrorTypography';
import FormThemeProvider from '../themes/FormThemeProvider';
import { login as globalLogin } from '../redux/user';

const useStyles = makeStyles({
  button: { marginTop: '8px' },
});

const RegisterPage = () => {
  const classes = useStyles();
  // eslint-disable-next-line no-use-before-define
  const addUser = () => register();
  const dispatch = useDispatch();

  const {
    values, errors, setErrors, onChange, onSubmit,
  } = useForm({
    submitCallback: addUser,
    initialState: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [register] = useMutation(REGISTER_USER, {
    update(proxy, { data: { register: userData } }) {
      dispatch(globalLogin(userData));
      navigate('/');
    },
    onError(err) {
      console.log(JSON.stringify(err, null, 2));
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  return (
    <FormThemeProvider>
      <FormPageContainer>
        <Typography component="h1" variant="h4" gutterBottom>
          Register to Slimy Tick
        </Typography>
        <Typography component="h2" variant="h6" gutterBottom>
          To have your first productive day
        </Typography>
        <form onSubmit={onSubmit}>
          <ErrorTypography lg error={errors.general} />
          <TextField
            id="email-input"
            name="email"
            label="Email"
            error={!!errors.email}
            value={values.email}
            onChange={onChange}
            color="primary"
            variant="outlined"
            margin="dense"
            inputProps={{ 'aria-label': 'email' }}
            fullWidth
          />
          <ErrorTypography error={errors.email} />
          <TextField
            id="password-input"
            name="password"
            label="Password"
            type="password"
            error={!!errors.password}
            value={values.password}
            onChange={onChange}
            color="primary"
            variant="outlined"
            margin="dense"
            inputProps={{ 'aria-label': 'password' }}
            fullWidth
          />
          <ErrorTypography error={errors.password} />

          <TextField
            id="confirm-password-input"
            name="confirmPassword"
            label="Confirm password"
            type="password"
            error={!!errors.confirmPassword}
            value={values.confirmPassword}
            onChange={onChange}
            color="primary"
            variant="outlined"
            margin="dense"
            inputProps={{ 'aria-label': 'confirm password' }}
            fullWidth
          />
          <ErrorTypography error={errors.confirmPassword} />

          <Button
            variant="outlined"
            color="primary"
            type="submit"
            size="large"
            className={classes.button}
            data-testid="register-button"
          >
            Register
          </Button>
        </form>
      </FormPageContainer>
    </FormThemeProvider>
  );
};

export default RegisterPage;
