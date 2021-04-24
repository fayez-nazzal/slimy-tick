import React from "react"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import { useDispatch } from "react-redux"
import { LOGIN_USER } from "../apollo/queries"
import { useMutation } from "@apollo/client"
import useForm from "../hooks/userForm"
import FormPageContainer from "../components/form/FormPageContainer"
import ErrorTypography from "../components/form/ErrorTypography"
import FormThemeProvider from "../themes/FormThemeProvider"
import { login as globalLogin } from "../redux/user"
import { navigate } from "gatsby"

const LoginPage = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const lgoinUser = () => login()

  const { values, errors, setErrors, onChange, onSubmit } = useForm({
    submitCallback: lgoinUser,
    initialState: {
      email: "",
      password: "",
    },
  })

  const [login, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, { data: { login: userData } }) {
      dispatch(globalLogin(userData))
      navigate("/")
    },
    onError(err) {
      console.log(JSON.stringify(err, null, 2))
      setErrors(err.graphQLErrors[0].extensions.errors)
    },
    variables: values,
  })

  return (
    <FormThemeProvider>
      <FormPageContainer>
        <Typography component="h1" variant="h4" gutterBottom>
          Login to Slimy Tick
        </Typography>
        <Typography component="h2" variant="h6" gutterBottom>
          Fill your account info
        </Typography>
        <form onSubmit={onSubmit}>
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
            inputProps={{ "aria-label": "email" }}
            fullWidth
          />
          <ErrorTypography>{errors.email}</ErrorTypography>
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
            inputProps={{ "aria-label": "password" }}
            fullWidth
          />
          <ErrorTypography>{errors.password}</ErrorTypography>
          <Button
            variant="outlined"
            color="primary"
            type="submit"
            size="large"
            data-testid="login-button"
            className={classes.button}
          >
            Login
          </Button>
        </form>
      </FormPageContainer>
    </FormThemeProvider>
  )
}

export default LoginPage

const useStyles = makeStyles({
  button: { marginTop: "8px" },
})
