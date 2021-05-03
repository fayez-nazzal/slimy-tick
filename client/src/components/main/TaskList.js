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

  const onTodoChange = (todoId, newBody) => {
    const todoIndex = group.todos.findIndex(todo => todo.id === todoId)
    let todo = group.todos[todoIndex]
    todo = {
      ...todo,
      body: newBody,
    }
    const newGroups = [...groups]
    const newTodos = [...newGroups[groupIndex].todos]
    newTodos[todoIndex] = todo
    newGroups[groupIndex] = {
      ...newGroups[groupIndex],
      todos: [...newTodos],
    }
    dispatch(setGroups(newGroups))
  }

  return (
    <List className={classes.root}>
      {group &&
        group.todos.map(todo => (
          <Task key={todo.id} {...todo} onChange={onTodoChange} />
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
