import React, { useRef, useState, useEffect } from "react"
import { Editor, EditorState, CompositeDecorator, ContentState } from "draft-js"
import {
  makeStyles,
  createMuiTheme,
  MuiThemeProvider,
} from "@material-ui/core/styles"
import "draft-js/dist/Draft.css"
import clsx from "clsx"
import IconButton from "@material-ui/core/IconButton"
import AlarmIcon from "@material-ui/icons/AlarmSharp"
import PriorityHighIcon from "@material-ui/icons/PriorityHighSharp"
import DateRangeIcon from "@material-ui/icons/DateRangeSharp"
import UpdateIcon from "@material-ui/icons/UpdateSharp"
import PlayArrowIcon from "@material-ui/icons/PlayArrowSharp"
import { CREATE_TODO } from "../apollo/queries"
import { useMutation } from "@apollo/client"
import { useDispatch, useSelector } from "react-redux"
import {
  addTodo,
  setDraftTodoBody,
  setDraftTodoGroup,
  setDraftTodoPriority,
} from "../redux/user"
import DraftStrategyComponent from "./DraftStrategyComponent"
import { toggleDuePicker } from "../redux/app"
import {
  matchDueDate,
  matchDueTime,
  matchRepeat,
  matchRemind,
  matchPriorityAndReturnRange,
} from "../utils/matchers"
import { ListItemIcon, MenuItem, Typography } from "@material-ui/core"
import ListItemText from "@material-ui/core/ListItemText"
import Menu from "./Menu"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#80b640",
    },
  },
})

let disableEditorBlur = false

const Input = () => {
  const dispatch = useDispatch()
  const draftTodoValues = useSelector(state => state.user.draftTodoValues)

  useEffect(() => {
    resetDraftTodo()
  }, [])

  const currentGroup = useSelector(
    state => state.user.userData.groups[state.user.groupIndex]
  )

  const [focus, setFocus] = useState(false)
  const editorRef = useRef(null)
  const [anchorEl, setAnchorEl] = useState(false)

  const classes = useStyles({ focus })
  const [createTodo, { loading }] = useMutation(CREATE_TODO, {
    update(proxy, { data: { createTodo: newTodo } }) {
      dispatch(addTodo(newTodo))
      clearEditor()
      resetDraftTodo()
    },
    onError(err) {
      console.log(JSON.stringify(err, null, 2))
    },
    variables: draftTodoValues,
  })

  // sets todo with empty body, low priority and current group the user at (from sidebar)
  const resetDraftTodo = () => {
    dispatch(setDraftTodoBody(""))
    dispatch(setDraftTodoGroup(currentGroup))
    dispatch(setDraftTodoPriority(4))
  }

  const clearEditor = () => {
    const emptyState = EditorState.push(
      editorState,
      ContentState.createFromText(""),
      "remove-range"
    )
    setEditorState(emptyState)
  }

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(
      new CompositeDecorator([
        {
          strategy: (contentBlock, callback, contentState) => {
            matchForStrategy(contentBlock, callback, contentState, str =>
              matchForStrategy(
                contentBlock,
                callback,
                contentState,
                matchPriorityAndReturnRange,
                true
              )
            )
          },
          component: props => <DraftStrategyComponent {...props} priority />,
        },
        {
          strategy: (contentBlock, callback, contentState) => {
            matchForStrategy(contentBlock, callback, contentState, matchRemind)
          },
          component: props => <DraftStrategyComponent {...props} remind />,
        },
        {
          strategy: (contentBlock, callback, contentState) => {
            matchForStrategy(contentBlock, callback, contentState, matchRepeat)
          },
          component: props => <DraftStrategyComponent {...props} repeat />,
        },
        ,
        {
          strategy: (contentBlock, callback, contentState) => {
            matchForStrategy(contentBlock, callback, contentState, matchDueDate)
          },
          component: props => <DraftStrategyComponent {...props} dueDate />,
        },
        {
          strategy: (contentBlock, callback, contentState) => {
            matchForStrategy(contentBlock, callback, contentState, matchDueTime)
          },
          component: props => <DraftStrategyComponent {...props} dueTime />,
        },
      ])
    )
  )

  const matchForStrategy = (
    contentBlock,
    callback,
    _,
    matcher,
    matcherReturnsRange
  ) => {
    const text = contentBlock.getText()
    const matchResult = matcher(text)

    if (matchResult && matcherReturnsRange) {
      return callback(matchResult[0], matchResult[1])
    }

    const matchIndex = text.lastIndexOf(matchResult)
    matchResult &&
      matchResult.length &&
      callback(matchIndex, matchIndex + matchResult.length)
  }

  const onDraftChange = state => {
    setEditorState(state)
    const newContent = state.getCurrentContent().getPlainText("\u0001")

    newContent !== draftTodoValues.body &&
      dispatch(setDraftTodoBody(newContent))
  }

  const disableEditorBlurTemporarily = () => {
    setTimeout(() => {
      disableEditorBlur = false
    }, 1)
  }

  const handleDueClicked = e => {
    dispatch(toggleDuePicker())
    disableEditorBlurTemporarily()
  }

  const handlePriorityClicked = e => {
    disableEditorBlurTemporarily()
  }

  const keepDraftEvents = {
    onMouseEnter: () => {
      disableEditorBlur = true
    },
    onMouseLeave: () => {
      disableEditorBlur = false
    },
  }

  return (
    <MuiThemeProvider theme={theme}>
      <div className={clsx([classes.root])}>
        <div className={clsx([classes.editorContainer])}>
          <Editor
            placeholder={"Type your task here \u2713"}
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
            handleReturn={() => "handled"}
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
          <IconButton size="small">
            <AlarmIcon color="primary" />
          </IconButton>
          <IconButton size="small">
            <UpdateIcon color="primary" />
          </IconButton>
          <IconButton
            onClick={e => {
              setAnchorEl(e.currentTarget)
            }}
            size="small"
            {...keepDraftEvents}
          >
            <PriorityHighIcon
              color="primary"
              className={clsx({
                "priority-veryhigh": draftTodoValues.priority === 1,
                "priority-high": draftTodoValues.priority === 2,
                "priority-medium": draftTodoValues.priority === 3,
                "priority-low": draftTodoValues.priority === 4,
              })}
            />
          </IconButton>
          <Menu anchorEl={anchorEl} onClose={() => setAnchorEl(false)}>
            <MenuItem onClick={() => dispatch(setDraftTodoPriority(1))}>
              <Typography
                variant="h6"
                component="p"
                className="priority-veryhigh"
              >
                !!!{" "}
              </Typography>
              <ListItemText primary="Very high" />
            </MenuItem>
            <MenuItem onClick={() => dispatch(setDraftTodoPriority(2))}>
              <Typography variant="h6" component="p" className="priority-high">
                !!{" "}
              </Typography>
              <ListItemText primary=" High" />
            </MenuItem>
            <MenuItem onClick={() => dispatch(setDraftTodoPriority(3))}>
              <Typography
                variant="h6"
                component="p"
                className="priority-medium"
              >
                !{" "}
              </Typography>
              <ListItemText primary="Medium" />
            </MenuItem>
            <MenuItem>
              <ListItemText primary="Low" />
            </MenuItem>
          </Menu>
          <IconButton
            size="small"
            {...keepDraftEvents}
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

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    margin: theme.spacing(1, "auto"),
    marginBottom: theme.spacing(2.25),
    width: "90%",
    transition: "all 0.3s",
    overflowX: "hidden",
    border: "1px solid #c4c4c4",
  },
  rowFlex: {
    flexGrow: 1,
    display: "flex",
  },
  editorContainer: {
    backgroundColor: "white",
    margin: theme.spacing(0, "auto"),
    overflowX: "hidden",
    padding: theme.spacing(0.8, 1),
    caretColor: "black !important",
    wordBreak: "keep-all",
    paddingBottom: props =>
      props.focus ? theme.spacing(4.8) : theme.spacing(0.8),
    width: "100%",
    minHeight: "1.2rem",
    fontSize: "18px",
    transition: "all 0.3s",
    borderRight: "3rem solid transparent",
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
}))
