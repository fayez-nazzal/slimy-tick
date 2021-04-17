import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Button, ButtonGroup } from "@material-ui/core"

const PriorityTabs = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <ButtonGroup fullWidth>
        <Button className={[classes.button, classes.all]}>All</Button>
        <Button className={[classes.button, classes.veryHigh]}>
          Very high
        </Button>
        <Button className={[classes.button, classes.high]}>High</Button>
        <Button className={[classes.button, classes.medium]}>Medium</Button>
        <Button className={[classes.button, classes.low]}>Low</Button>
      </ButtonGroup>
    </div>
  )
}

export default PriorityTabs

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: "auto",
    borderRadius: 0,
    background: "transparent",
  },
  button: {
    color: "transparent",
    marginTop: "auto",
    textTransform: "none",
    border: "none",
    height: 10,
    borderRadius: 0,
    "&:hover": {
      color: "black",
      height: 20,
    },
  },
  all: {
    backgroundColor: "#cccccc !important",
  },
  veryHigh: {
    backgroundColor: "#ed5f00 !important",
  },
  high: {
    backgroundColor: "#f48c00 !important",
  },
  medium: {
    backgroundColor: "#f5b900 !important",
  },
  low: {
    backgroundColor: "#7dbc00 !important",
  },
}))
