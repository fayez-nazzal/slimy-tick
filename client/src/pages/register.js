import React from "react"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import { makeStyles, creat } from "@material-ui/core/styles"
import { REGISTER_USER } from "../apollo/queries"
import { useMutation } from "@apollo/client"
import useForm from "../hooks/userForm"
import FormPageContainer from "../components/form/FormPageContainer"
import ErrorTypography from "../components/form/ErrorTypography"
import FormThemeProvider from "../themes/FormThemeProvider"
import { login as globalLogin } from "../redux/user"
import { useDispatch } from "react-redux"
import { navigate } from "gatsby"

const LoginPage = () => {
  const classes = useStyles()
  const addUser = () => register()
  const dispatch = useDispatch()

  const { values, errors, setErrors, onChange, onSubmit } = useForm({
    submitCallback: addUser,
    initialState: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const [register, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, { data: { register: userData } }) {
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
          Register to Slimy Tick
        </Typography>
        <Typography component="h2" variant="h6" gutterBottom>
          To have your first productive day
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
            inputProps={{ "aria-label": "confirm password" }}
            fullWidth
          />
          <ErrorTypography>{errors.confirmPassword}</ErrorTypography>

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
  )
}

export default LoginPage

const useStyles = makeStyles({
  button: { marginTop: "8px" },
})
