import React, { useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import clsx from "clsx"
import { createMuiTheme } from "@material-ui/core/styles"
import {
  setDrafttaskDueDate,
  setDrafttaskDueTime,
  setDrafttaskPriority,
  setDrafttaskRepeat,
} from "../redux/user"
import { useDispatch } from "react-redux"
import { findRepeatOptions } from "../utils/regexAnalyzers"
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2dc065",
    },
    secondary: {
      main: "#bedc9b",
    },
  },
})

const DraftStrategyComponent = props => {
  const dispatch = useDispatch()

  const classes = useStyles({
    ...props,
    theme,
  })

  useEffect(() => {
    const textContent = props.children[0].props.text.trim()
    props.priority &&
      dispatch(
        setDrafttaskPriority(
          textContent === "!!!" ? 1 : textContent === "!!" ? 2 : 3
        )
      )
    props.dueDate && dispatch(setDrafttaskDueDate(textContent))
    props.dueTime && dispatch(setDrafttaskDueTime(textContent))
    props.repeat && dispatch(setDrafttaskRepeat(textContent))
  }, [props.children])

  useEffect(() => {
    return () => {
      props.priority && dispatch(setDrafttaskPriority(4))
      props.dueDate && dispatch(setDrafttaskDueDate(null))
      props.dueTime && dispatch(setDrafttaskDueTime(""))
      props.repeat && dispatch(setDrafttaskRepeat(""))
    }
  }, [])

  const textContent = props.children[0].props.text.trim()
  const priority =
    props.priority && textContent === "!!!" ? 1 : textContent === "!!" ? 2 : 3
  const length = props.children[0].props.text.length

  return (
    <span
      className={clsx({
        [classes.textColored]: props.priority,
        "priority-veryhigh": props.priority && length === 3,
        "priority-high": props.priority && length === 2,
        "priority-medium": props.priority && length === 1,
        [classes.fullColored]: !props.priority,
      })}
      data-testid={
        props.priority
          ? `draft-priority-${priority}`
          : props.dueDate
          ? "draft-duedate"
          : props.dueTime
          ? "draft-duetime"
          : props.repeat
          ? "draft-repeat"
          : ""
      }
    >
      {props.children}
    </span>
  )
}

export default DraftStrategyComponent

const useStyles = makeStyles({
  fullColored: {
    padding: props => props.theme.spacing(0, 0.3),
    margin: props => props.theme.spacing(0, 0.3),
    fontWeight: "bold",
    backgroundColor: props =>
      clsx({
        "#ffb70390": props.dueDate,
        "#ff790090": props.dueTime,
        "#4895ef90": props.remind,
        "#76c89390": props.repeat,
      }),
  },
  textColored: {
    padding: props => props.theme.spacing(0.2, 0.2),
    margin: props => props.theme.spacing(0, 0.1),
    fontWeight: "bolder",
  },
})
