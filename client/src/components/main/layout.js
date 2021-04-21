import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Helmet } from "react-helmet"
import CssBaseline from "@material-ui/core/CssBaseline"
import Navbar from "./Navbar"
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles"
import { drawerWidth } from "../../data/globals"
import Sidebar from "./Sidebar"
import Content from "./Content"
import TaskList from "./TaskList"
import DateTimePicker from "../DateTimePicker"
const baseTheme = createMuiTheme()

const Layout = ({ children }) => {
  const classes = useStyles()
  const [drawerOpen, setOpen] = React.useState(true)
  const [filter, setFilter] = React.useState("ALL")

  const toggleDrawer = () => {
    setOpen(prev => !prev)
  }

  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <ThemeProvider theme={baseTheme}>
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
          drawerWidth={drawerWidth}
          drawerOpen={drawerOpen}
          filter={filter}
          setFilter={setFilter}
        />
        <Sidebar open={drawerOpen} toggle={toggleDrawer} />
        <Content drawerOpen={drawerOpen}>
          <TaskList />
          <DateTimePicker />
        </Content>
      </div>
    </ThemeProvider>
  )
}

export default Layout

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    maxHeight: "100vh",
  },
}))
