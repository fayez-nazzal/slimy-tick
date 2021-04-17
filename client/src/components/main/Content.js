import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import clsx from "clsx"
import PriorityTabs from "../PriorityTabs"
import Input from "../Input"
import { useMediaQuery } from "@material-ui/core"

const Content = ({ children, drawerOpen }) => {
  const sm = useMediaQuery(theme => theme.breakpoints.up("sm"))
  const onlySm = useMediaQuery(theme => theme.breakpoints.only("sm"))
  const classes = useStyles({ sm, onlySm })

  return (
    <main
      className={clsx(classes.content, {
        [classes.contentShift]: drawerOpen,
      })}
    >
      <div className={classes.padded}>
        <Input />
        {children}
      </div>
      <PriorityTabs />
    </main>
  )
}

export default Content

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: props => (props.onlySm ? "26vw" : props.sm ? "20vw" : 0),
  },
  padded: {
    padding: theme.spacing(1.25),
  },
}))
