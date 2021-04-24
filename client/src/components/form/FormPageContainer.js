import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Container from "@material-ui/core/Container"
import Logo from "../../svg/logo.svg"
import { StaticImage } from "gatsby-plugin-image"
import { Link } from "gatsby"

const FormPageContainer = ({ children }) => {
  const classes = useStyles()
  const location = window.location

  return (
    <Container disableGutters className={classes.container}>
      <div className={classes.buttonsContainer}>
        <Link className={classes.link} to="/register">
          <Button
            color="secondary"
            className={classes.button}
            variant="contained"
            size="large"
            disabled={location.pathname.toLowerCase().includes("register")}
          >
            Register
          </Button>
        </Link>
        <Link className={classes.link} to="/login">
          <Button
            color="secondary"
            className={classes.button}
            variant="contained"
            size="large"
            disabled={location.pathname.toLowerCase().includes("login")}
          >
            Login
          </Button>
        </Link>
      </div>
      <div className={classes.logoContainer}>
        <Logo className={classes.logo} />
      </div>
      <StaticImage
        className={"background"}
        alt="green background"
        quality={100}
        src="../../images/background.jpg"
      />
      <Container maxWidth="sm" className={classes.innerContainer}>
        {children}
      </Container>
    </Container>
  )
}

export default FormPageContainer

const useStyles = makeStyles({
  container: {
    position: "relative",
    width: "100vw",
    margin: "0",
    height: "100vh",
    maxWidth: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  innerContainer: {
    textAlign: "center",
    padding: "1rem 3rem",
    zIndex: "1000",
    backgroundColor: "rgb(250, 250, 250, 0.9)",
  },
  buttonsContainer: {
    position: "absolute",
    top: "0px",
    right: "0px",
    zIndex: "10000",
  },
  button: {
    margin: "1rem",
  },
  logoContainer: {
    position: "absolute",
    top: "0px",
    left: "0px",
    zIndex: "10000",
  },
  logo: {
    height: "3rem",
    width: "13rem",
    margin: "1rem",
  },
  link: {
    textDecoration: "none",
  },
})
