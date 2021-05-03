import Container from "@material-ui/core/Container"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import List from "@material-ui/core/List"
import { makeStyles } from "@material-ui/core/styles"
import { Task } from "../Task"
import { setGroups } from "../../redux/user"

const TaskList = props => {
  const classes = useStyles()
  const groupIndex = useSelector(state => state.user.groupIndex)
  const groups = useSelector(state => state.user.userData.groups)
  const group = useSelector(
    state => state.user.userData.groups[state.user.groupIndex]
  )
  const dispatch = useDispatch()

  const ontaskChange = (taskId, newBody) => {
    const taskIndex = group.tasks.findIndex(task => task.id === taskId)
    let task = group.tasks[taskIndex]
    task = {
      ...task,
      body: newBody,
    }
    const newGroups = [...groups]
    const newtasks = [...newGroups[groupIndex].tasks]
    newtasks[taskIndex] = task
    newGroups[groupIndex] = {
      ...newGroups[groupIndex],
      tasks: [...newtasks],
    }
    dispatch(setGroups(newGroups))
  }

  return (
    <List className={classes.root}>
      {group &&
        group.tasks.map(task => (
          <Task key={task.id} {...task} onChange={ontaskChange} />
        ))}
    </List>
  )
}

export default TaskList

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}))
