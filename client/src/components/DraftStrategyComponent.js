import React from "react"
import { makeStyles } from "@material-ui/core/styles"

const DraftStrategyComponent = props => {
  const classes = useStyles()

  return (
    <span
      className={
        props.due
          ? classes.dueSpan
          : props.remind
          ? classes.remindSpan
          : classes.repeatSpan
      }
    >
      {props.children}
    </span>
  )
}

export default DraftStrategyComponent

const useStyles = makeStyles(theme => ({
  dueSpan: {
    padding: theme.spacing(0, 0.3),
    margin: theme.spacing(0, 0.1),
    backgroundColor: "#ffb70390",
    fontWeight: "bold",
  },
  remindSpan: {
    padding: theme.spacing(0, 0.3),
    margin: theme.spacing(0, 0.1),
    backgroundColor: "#4895ef90",
    fontWeight: "bold",
  },
  repeatSpan: {
    padding: theme.spacing(0, 0.3),
    margin: theme.spacing(0, 0.1),
    backgroundColor: "#76c89390",
    fontWeight: "bold",
  },
}))
