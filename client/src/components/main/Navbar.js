import React from "react"
import AppBar from "@material-ui/core/AppBar"
import clsx from "clsx"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"
import {
  createMuiTheme,
  makeStyles,
  MuiThemeProvider,
} from "@material-ui/core/styles"
import { Button, ButtonGroup, useMediaQuery } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#f6f7ff",
    },
  },
})

const iconsTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#bedc9b",
    },
  },
})

const NavBar = props => {
  const sm = useMediaQuery(theme => theme.breakpoints.up("sm"))
  const onlySm = useMediaQuery(theme => theme.breakpoints.only("sm"))
  const classes = useStyles({ sm, onlySm })

  return (
    <MuiThemeProvider theme={theme}>
      <AppBar
        color="primary"
        position="sticky"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: props.drawerOpen,
        })}
      >
        <Toolbar className={classes.toolbar} variant="dense" disableGutters>
          <MuiThemeProvider theme={iconsTheme}>
            <IconButton
              color="inherit"
              onClick={props.toggleDrawer}
              edge="start"
              className={clsx(
                classes.menuButton,
                props.drawerOpen && classes.hide
              )}
            >
              <MenuIcon color="primary" className={classes.largeIcon} />
            </IconButton>
          </MuiThemeProvider>
          <ButtonGroup fullWidth>
            <Button
              className={clsx(classes.button, {
                [classes.selectedButton]: props.filter === "ALL",
              })}
              onClick={() => props.setFilter("ALL")}
            >
              All
            </Button>
            <Button
              className={clsx(classes.button, {
                [classes.selectedButton]: props.filter === "TODAY",
              })}
              onClick={() => props.setFilter("TODAY")}
            >
              Today
            </Button>
            <Button
              className={clsx(classes.button, {
                [classes.selectedButton]: props.filter === "TOMORROW",
              })}
              onClick={() => props.setFilter("TOMORROW")}
            >
              Tomorrow
            </Button>
            <Button
              className={clsx(classes.button, {
                [classes.selectedButton]: props.filter === "NEXT 7 DAYS",
              })}
              onClick={() => props.setFilter("NEXT 7 DAYS")}
            >
              Next 7 days
            </Button>
            <MuiThemeProvider theme={iconsTheme}>
              <IconButton>
                <AddIcon color="primary" />
              </IconButton>
            </MuiThemeProvider>
          </ButtonGroup>
        </Toolbar>
      </AppBar>
    </MuiThemeProvider>
  )
}

export default NavBar

const useStyles = makeStyles(theme => ({
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    boxShadow: "none",
    borderBottom: "0.5px solid #d8d9e0",
    boxSizing: "border-box",
  },
  appBarShift: {
    width: props =>
      `calc(100% - ${props.onlySm ? "26vw" : props.sm ? "20vw" : "0px"})`,
    marginLeft: props => (props.onlySm ? "26vw" : props.sm ? "20vw" : 0),
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    margin: theme.spacing(0, 2, 0, 0.12),
  },
  button: {
    border: 0,
    borderRadius: 0,
  },
  selectedButton: {
    backgroundColor: "#bedc9b",
    "&:hover": {
      backgroundColor: "#ceddbc",
    },
  },
  hide: {
    display: "none",
  },
  largeIcon: {
    transform: "scale(1.2)",
  },
}))
