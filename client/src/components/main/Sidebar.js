import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import moment from "moment"
import Drawer from "@material-ui/core/Drawer"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Box from "@material-ui/core/Box"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import { drawerWidth } from "../../data/globals"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import AddBoxSharpIcon from "@material-ui/icons/AddBoxSharp"
import { useDispatch, useSelector } from "react-redux"
import AccountBoxSharpIcon from "@material-ui/icons/AccountBoxSharp"
import { setGroupIndex } from "../../redux/user"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#bedc9b",
    },
  },
})

const Sidebar = props => {
  const userData = useSelector(state => state.user.userData)
  const currentGroup = useSelector(
    state => state.user.userData.groups[state.user.groupIndex]
  )
  const dispatch = useDispatch()

  const onlySm = useMediaQuery(theme => theme.breakpoints.only("sm"))
  const classes = useStyles({ onlySm })

  return (
    <MuiThemeProvider theme={theme}>
      <Box display={{ xs: "none", sm: "block" }}>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={props.open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.flex}>
            <AccountBoxSharpIcon className={classes.profilePic} />
            <Box flexGrow={1} className={classes.accountInfo}>
              <Typography variant="subtitle1">
                {userData &&
                  userData.email.slice(0, userData.email.indexOf("@"))}
              </Typography>
              <Typography variant="p" color="textSecondary">
                {moment(userData && userData.created)
                  .format("DD-MM-YYYY")
                  .toString()}
              </Typography>
            </Box>
            <Box>
              <IconButton onClick={props.toggle}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon
                    color="primary"
                    className={classes.largeIcon}
                  />
                ) : (
                  <ChevronLeftIcon
                    color="primary"
                    className={classes.largeIcon}
                  />
                )}
              </IconButton>
            </Box>
          </div>
          <div className={classes.flex}>
            <Box flexGrow={1}>
              <Typography variant="h5" color="textSecondary">
                Groups
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <AddBoxSharpIcon color="primary" />
              </IconButton>
            </Box>
          </div>
          <div className={classes.columnFlex}>
            {userData &&
              userData.groups.map((group, index) => (
                <Button
                  key={group.id}
                  onClick={() => dispatch(setGroupIndex(index))}
                  className={classes.groupButton}
                  variant={
                    currentGroup && group.name === currentGroup.name
                      ? "contained"
                      : "text"
                  }
                  color={
                    currentGroup && group.name === currentGroup.name
                      ? "primary"
                      : "none"
                  }
                  fullWidth
                >
                  {group.name}
                </Button>
              ))}
          </div>
        </Drawer>
      </Box>
    </MuiThemeProvider>
  )
}

export default Sidebar

const useStyles = makeStyles({
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 1,
    boxSizing: "border-box",
  },
  drawerPaper: {
    width: props => (props.onlySm ? "26vw" : "20vw"),
    background: "#f6f7ff",
    borderRight: "1px #999999 solid",
  },
  flex: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  columnFlex: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    width: "100%",
  },
  largeIcon: {
    transform: "scale(1.2)",
  },
  accountInfo: {
    display: "inline-flex",
    flexDirection: "column",
    marginRight: "auto",
    justifyContent: "space-around",
  },
  profilePic: {
    width: "54px",
    height: "54px",
  },
  groupButton: {
    textTransform: "none",
    fontSize: "20px",
    boxShadow: "none",
    borderRadius: "0px",
  },
})
