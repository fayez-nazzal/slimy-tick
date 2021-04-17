import React, { useEffect, useRef, useState } from "react"
import { Editor, EditorState, CompositeDecorator } from "draft-js"
import {
  makeStyles,
  createMuiTheme,
  MuiThemeProvider,
} from "@material-ui/core/styles"
import "draft-js/dist/Draft.css"
import clsx from "clsx"
import { IconButton } from "@material-ui/core"
import AlarmIcon from "@material-ui/icons/AlarmSharp"
import PriorityHighIcon from "@material-ui/icons/PriorityHighSharp"
import DateRangeIcon from "@material-ui/icons/DateRangeSharp"
import UpdateIcon from "@material-ui/icons/UpdateSharp"
import PlayArrowIcon from "@material-ui/icons/PlayArrowSharp"
import { CREATE_TODO, LOGIN_USER } from "../apollo/queries"
import { useMutation } from "@apollo/client"
import { addTodo, login as globalLogin } from "../redux/user"
import { navigate } from "gatsby"
import { useDispatch, useSelector } from "react-redux"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#80b640",
    },
  },
})

const Input = () => {
  const dispatch = useDispatch()
  const [focus, setFocus] = useState(false)
  const [values, setValues] = useState({
    groupName: "group 1",
    body: "new Todo",
    priority: 4,
  })
  const priority = useRef("")
  const classes = useStyles({ focus })
  const [createTodo, { loading }] = useMutation(CREATE_TODO, {
    update(proxy, { data: { createTodo: newTodo } }) {
      console.log(newTodo)
      dispatch(addTodo(newTodo))
    },
    onError(err) {
      console.log(JSON.stringify(err, null, 2))
    },
    variables: values,
  })

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(
      new CompositeDecorator([
        {
          strategy: handleVeryHighStrategy,
          component: props => <PrioritySpan {...props} veryHigh />,
        },
        {
          strategy: handleHighStrategy,
          component: props => <PrioritySpan {...props} high />,
        },
        {
          strategy: handleMediumStrategy,
          component: props => <PrioritySpan {...props} medium />,
        },
      ])
    )
  )

  function handleVeryHighStrategy(contentBlock, callback, contentState) {
    const text = contentBlock.getText()
    const lastOc = text.lastIndexOf("!!!")
    text.indexOf("!", lastOc + 3) === -1 &&
      findMatches("!!!", contentBlock, callback, contentState)
  }

  function handleHighStrategy(contentBlock, callback, contentState) {
    const text = contentBlock.getText()
    const lastOc = text.lastIndexOf("!!")
    text.indexOf("!", lastOc + 2) === -1 &&
      findMatches("!!", contentBlock, callback, contentState)
  }

  function handleMediumStrategy(contentBlock, callback, contentState) {
    findMatches("!", contentBlock, callback, contentState)
  }

  function findMatches(type, contentBlock, callback, contentState) {
    console.log(contentState.getEntityMap())
    const text = contentBlock.getText()
    const textIndex = text.lastIndexOf(type)

    textIndex > -1 && callback(textIndex, textIndex + type.length)
    priority.current = type
  }

  return (
    <MuiThemeProvider theme={theme}>
      <div className={clsx([classes.root])}>
        <div className={clsx([classes.editorContainer])}>
          <Editor
            placeholder="Type your task here"
            editorState={editorState}
            onChange={setEditorState}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            handleReturn={() => false}
          />
        </div>
        <IconButton
          size="small"
          className={classes.submitButton}
          onClick={createTodo}
        >
          <PlayArrowIcon color="primary" className={classes.playIcon} />
        </IconButton>
        <div className={clsx([classes.rowFlex, classes.tools])}>
          <AlarmIcon color="primary" />
          <UpdateIcon color="primary" />
          <PriorityHighIcon color="primary" />
          <DateRangeIcon color="primary" />
        </div>
      </div>
    </MuiThemeProvider>
  )
}

export default Input

const PrioritySpan = props => {
  const classes = useStyles()

  return (
    <span
      className={clsx([
        classes.prioritySpan,
        {
          [classes.veryHigh]: props.veryHigh,
          [classes.high]: props.high,
          [classes.medium]: props.medium,
        },
      ])}
    >
      {props.children}
    </span>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    margin: theme.spacing(1, "auto"),
    marginBottom: theme.spacing(2.25),
    width: "90%",
    height: props => (props.focus ? "3.8rem" : "2.4rem"),
    transition: "all 0.3s",
  },
  rowFlex: {
    flexGrow: 1,
    display: "flex",
  },
  editorContainer: {
    backgroundColor: "white",
    margin: theme.spacing(0, "auto"),
    padding: theme.spacing(0.8, 1),
    width: "100%",
    height: "100%",
    fontSize: "18px",
    transition: "all 0.3s",
    border: "1px solid #cfcfcf",
  },
  submitButton: {
    zIndex: "1000",
    position: "absolute",
    right: "0.1rem",
    top: 0,
    bottom: 0,
    transform: props => (props.focus ? "scaleX(1)" : "scaleX(0)"),
    transition: "all 0.1s ease-in-out 0.1s",
    cursor: "pointer",
  },
  playIcon: {
    width: "2.4rem",
    height: "2.4rem",
  },
  tools: {
    position: "absolute",
    bottom: 4,
    left: 4,
    transform: props => (props.focus ? "scaleX(1)" : "scaleX(0)"),
    opacity: props => (props.focus ? 1 : 0),
    transition: "transform 0.1s ease-in-out, opacity 0.4s ease-in-out 0.1s",
  },
  toolIcon: {
    display: "none",
    transition: "all 0.3s",
  },
  activeToolIcon: {
    transition: "all 0.3s",
  },
  prioritySpan: {
    padding: theme.spacing(0.2, 0.2),
    margin: theme.spacing(0, 0.1),
    fontWeight: "bolder",
  },
  veryHigh: {
    color: "#ed5f00",
  },
  high: {
    color: "#f48c00",
  },
  medium: {
    color: "#f5b900",
  },
}))
