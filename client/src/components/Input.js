import React, { useEffect, useRef, useState } from "react"
import { Editor, EditorState, CompositeDecorator, ContentState } from "draft-js"
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
import { useDispatch, useSelector } from "react-redux"
import {
  DUE_DATE_REGEX,
  DUE_TIME_REGEX,
  REMIND_REGEX,
  REPEAT_REGEX,
} from "../data/regex"
import DraftStrategyComponent from "./DraftStrategyComponent"
import { toggleDuePicker } from "../redux/app"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#80b640",
    },
  },
})

const removeSymbolicPartsFromText = text => {
  return text.replace(" ! ", "").replace(" !! ", "").replace(" !!! ", "")
}

let disableEditorBlur = false

const Input = () => {
  const dispatch = useDispatch()
  const currentGroup = useSelector(
    state => state.user.userData.groups[state.user.groupIndex]
  )
  const [focus, setFocus] = useState(false)
  const [values, setValues] = useState({
    groupName: currentGroup.name,
    body: "",
    priority: 4,
  })
  const editorRef = useRef(null)

  const classes = useStyles({ focus })
  const [createTodo, { loading }] = useMutation(CREATE_TODO, {
    update(proxy, { data: { createTodo: newTodo } }) {
      dispatch(addTodo(newTodo))
      const emptyState = EditorState.push(
        editorState,
        ContentState.createFromText(""),
        "remove-range"
      )
      setEditorState(emptyState)
      setValues(prev => ({ ...prev, body: "" }))
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
        {
          strategy: remindStrategy,
          component: props => <DraftStrategyComponent {...props} remind />,
        },
        {
          strategy: repeatStrategy,
          component: props => <DraftStrategyComponent {...props} repeat />,
        },
        ,
        {
          strategy: dueDateStrategy,
          component: props => <DraftStrategyComponent {...props} due />,
        },
        {
          strategy: dueTimeStrategy,
          component: props => <DraftStrategyComponent {...props} due />,
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

  function remindStrategy(contentBlock, callback, contentState) {
    findWithRegex(REMIND_REGEX, contentBlock, callback)
  }

  function repeatStrategy(contentBlock, callback, contentState) {
    findWithRegex(REPEAT_REGEX, contentBlock, callback)
  }

  function dueDateStrategy(contentBlock, callback, contentState) {
    findWithRegex(DUE_DATE_REGEX, contentBlock, callback)
  }

  function dueTimeStrategy(contentBlock, callback, contentState) {
    findWithRegex(DUE_TIME_REGEX, contentBlock, callback)
  }

  function findWithRegex(regex, contentBlock, callback) {
    const text = contentBlock.getText()
    let match = text.match(regex)
    console.log(match)
    match = match ? match.filter(Boolean) : []
    console.log("filter ")
    console.log(match)
    match.length &&
      callback(
        text.lastIndexOf(match[0]),
        text.lastIndexOf(match[0]) + match[0].length
      )
  }

  function findMatches(type, contentBlock, callback, contentState) {
    const text = contentBlock.getText()
    const textIndex = text.lastIndexOf(type)

    textIndex > -1 && callback(textIndex, textIndex + type.length)
    setValues(values => ({ ...values, priority: type.length }))
  }

  const onDraftChange = state => {
    setEditorState(state)
    const newContent = removeSymbolicPartsFromText(
      state.getCurrentContent().getPlainText("\u0001")
    )
    newContent !== values.body &&
      setValues(values => ({ ...values, body: newContent }))
  }

  const handleDueClicked = e => {
    dispatch(toggleDuePicker())
    setTimeout(() => {
      disableEditorBlur = false
    }, 1)
  }

  return (
    <MuiThemeProvider theme={theme}>
      <div className={clsx([classes.root])}>
        <div className={clsx([classes.editorContainer])}>
          <Editor
            placeholder="Type your task here"
            ref={editorRef}
            editorState={editorState}
            onChange={onDraftChange}
            onFocus={() => setFocus(true)}
            onBlur={() => {
              setTimeout(() => {
                if (disableEditorBlur) return
                setFocus(false)
              })
            }}
            handleReturn={() => false}
          />
        </div>
        <IconButton
          size="small"
          className={classes.submitButton}
          onMouseDown={createTodo}
        >
          <PlayArrowIcon color="primary" className={classes.playIcon} />
        </IconButton>
        <div className={clsx([classes.rowFlex, classes.tools])}>
          <IconButton size="small">
            <AlarmIcon color="primary" />
          </IconButton>
          <IconButton size="small">
            <UpdateIcon color="primary" />
          </IconButton>
          <IconButton size="small">
            <PriorityHighIcon color="primary" />
          </IconButton>
          <IconButton
            size="small"
            onMouseEnter={() => {
              disableEditorBlur = true
            }}
            onMouseLeave={() => {
              disableEditorBlur = false
            }}
            onClick={handleDueClicked}
          >
            <DateRangeIcon color="primary" />
          </IconButton>
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
    paddingBottom: props =>
      props.focus ? theme.spacing(4.8) : theme.spacing(0.8),
    paddingRight: theme.spacing(5),
    width: "100%",
    minHeight: "2.4rem",
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
