import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { navigate } from "gatsby-link"
import jwtDecode from "jwt-decode"
import { Helmet } from "react-helmet"
import CssBaseline from "@material-ui/core/CssBaseline"
import Navbar from "../components/main/Navbar"
import Sidebar from "../components/main/Sidebar"
import TaskList from "../components/main/TaskList"
import clsx from "clsx"
import PriorityTabs from "../components/PriorityTabs"
import TodoInput from "../components/TodoInput"
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles"
import { graphql } from "gatsby"
import useMediaQuery from "@material-ui/core/useMediaQuery"

const Index = ({ data }) => {
  const sm = useMediaQuery(theme => theme.breakpoints.up("sm"))
  const onlySm = useMediaQuery(theme => theme.breakpoints.only("sm"))
  const classes = useStyles({ sm, onlySm })
  const [drawerOpen, setOpen] = React.useState(true)
  const [filter, setFilter] = React.useState("ALL")

  const toggleDrawer = () => {
    setOpen(prev => !prev)
  }

  const userData = useSelector(state => state.user)

  const token = localStorage.getItem("slimy-tick-jwt")

  if (!userData && token) {
    const decodedToken = jwtDecode(token)

    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem("jwt")
    } else {
      console.log(decodedToken)
    }
  }

  if (!userData) {
    navigate("/login")
  }

  return (
    <div className={classes.root}>
      <Helmet>
        <title>{data.site.siteMetadata.title}</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Helmet>
      <CssBaseline />
      <Navbar
        toggleDrawer={toggleDrawer}
        drawerOpen={drawerOpen}
        filter={filter}
        setFilter={setFilter}
      />
      <Sidebar open={drawerOpen} toggle={toggleDrawer} />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: drawerOpen,
        })}
      >
        <div className={classes.padded}>
          <TodoInput />
          <TaskList />
        </div>
        <PriorityTabs />
      </main>
    </div>
  )
}

export default Index

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    maxHeight: "100vh",
  },
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

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
