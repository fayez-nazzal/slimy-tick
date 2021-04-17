import { Container } from "@material-ui/core"
import React from "react"
import { useSelector } from "react-redux"
import List from "@material-ui/core/List"
import { makeStyles } from "@material-ui/core/styles"
import { Task } from "../Task"

const TaskList = props => {
  const classes = useStyles()

  const group = useSelector(
    state => state.user.userData.groups[state.user.groupIndex]
  )

  return (
    <List className={classes.root}>
      {group && group.todos.map(todo => <Task key={todo.id} {...todo} />)}
    </List>
  )
}

export default TaskList

const useStyles = makeStyles(theme => ({
  root: {
    width: "100vw",
    maxWidth: "100vw",
    backgroundColor: theme.palette.background.paper,
  },
}))
