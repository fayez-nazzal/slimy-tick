import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"

const ErrorTypography = props => {
  const classes = useStyles(props)
  return (
    <Typography
      color="error"
      variant="subtitle1"
      display="block"
      className={classes.error}
    >
      {props.error && (
        <>
          {"\u2022 "} {props.error}
        </>
      )}
    </Typography>
  )
}

export default ErrorTypography

const useStyles = makeStyles({
  button: { marginTop: "8px" },
  projectCompletedIcon: {
    position: "fixed",
    height: 280,
    bottom: "0px",
    right: 20,
  },
  error: {
    whiteSpace: "pre",
    height: props => (props.lg ? "20px" : "18px"),
    fontSize: props => (props.lg ? "18px !important" : "16px !important"),
  },
})
