import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import clsx from "clsx"
import { createMuiTheme } from "@material-ui/core/styles"

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
  const classes = useStyles({
    ...props,
    theme,
    length: props.children[0].props.text.length,
  })

  return (
    <span
      className={clsx({
        [classes.textColored]: props.priority,
        [classes.fullColored]: !props.priority,
      })}
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
    color: props =>
      clsx({
        "#ed5f00": props.length === 3,
        "#f48c00": props.length === 2,
        "#f5b900": props.length === 1,
      }),
  },
})
