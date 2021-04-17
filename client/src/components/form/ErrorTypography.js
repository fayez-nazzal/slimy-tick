import React from "react"
import { Typography, makeStyles } from "@material-ui/core"

const ErrorTypography = ({ children }) => {
  const classes = useStyles()
  return (
    <Typography
      color="error"
      variant="p"
      display="block"
      className={classes.error}
    >
      {children}
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
    height: "16px",
    fontSize: "16px !important",
  },
})
