import React, { useRef, useState, useEffect } from "react"
import {
  Editor,
  EditorState,
  CompositeDecorator,
  ContentState,
  Modifier,
  SelectionState,
} from "draft-js"
import {
  makeStyles,
  createMuiTheme,
  MuiThemeProvider,
} from "@material-ui/core/styles"
import "draft-js/dist/Draft.css"
import clsx from "clsx"
import PriorityHighIcon from "@material-ui/icons/PriorityHighSharp"
import DateRangeIcon from "@material-ui/icons/DateRangeSharp"
import UpdateIcon from "@material-ui/icons/UpdateSharp"
import PlayArrowIcon from "@material-ui/icons/PlayArrowSharp"
import { CREATE_task } from "../apollo/queries"
import { useMutation } from "@apollo/client"
import { useDispatch, useSelector } from "react-redux"
import {
  addtask,
  setDrafttaskBody,
  setDrafttaskGroup,
  setDrafttaskPriority,
} from "../redux/user"
import DraftStrategyComponent from "./DraftStrategyComponent"
import {
  matchDueDate,
  matchDueTime,
  matchRepeat,
  matchPriorityAndReturnRange,
} from "../utils/matchers"
import BasicDateTimePicker from "./DateTimePicker"
import ButtonGroupButton from "./general/ButtonGroupIconButton"
import RepeatMenu from "./menus/RepeatMenu"
import CustomRepeatPopover from "./menus/CustomRepeatPopover"
import PriorityMenu from "./menus/PriorityMenu"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#80b640",
    },
  },
})

let disableEditorBlur = false

const TaskInput = () => {
  const dispatch = useDispatch()
  const drafttaskValues = useSelector(state => state.user.drafttaskValues)

  useEffect(() => {
    resetDrafttask()
  }, [])

  useEffect(() => {
    const currentDraftText = editorState
      .getCurrentContent()
      .getPlainText("\u0001")

    if (drafttaskValues.body !== currentDraftText) {
      setDraftBodyText(drafttaskValues.body)
    }
  }, [drafttaskValues.body])

  const currentGroup = useSelector(
    state => state.user.userData.groups[state.user.groupIndex]
  )

  const [focus, setFocus] = useState(false)
  const editorRef = useRef(null)
  const [priorityAnchorEl, setPriorityAnchorEl] = useState(false)
  const [dueAnchorEl, setDueAnchorEl] = useState(false)
  const [repeatAnchorEl, setRepeatAnchorEl] = useState(false)
  const [customRepeatAnchorEl, setCustomRepeatAncorEl] = useState(false)

  const classes = useStyles({ focus })
  const [createtask, { loading }] = useMutation(CREATE_task, {
    update(proxy, { data: { createtask: newtask } }) {
      dispatch(addtask(newtask))
      clearEditor()
      resetDrafttask()
    },
    onError(err) {
      console.log(JSON.stringify(err, null, 2))
    },
    variables: drafttaskValues,
  })

  // sets task with empty body, low priority and current group the user at (from sidebar)
  const resetDrafttask = () => {
    dispatch(setDrafttaskBody(""))
    dispatch(setDrafttaskGroup(currentGroup))
    dispatch(setDrafttaskPriority(4))
  }

  const setDraftBodyText = newText => {
    const currentDraftText = editorState
      .getCurrentContent()
      .getPlainText("\u0001")

    const selection = editorState.getSelection()
    const contentState = editorState.getCurrentContent()
    const block = contentState.getBlockForKey(selection.getAnchorKey())

    // this is not the best way to replace
    // but i think it wont impact performance, most tasks text is short
    const replaced = Modifier.replaceText(
      contentState,
      new SelectionState({
        anchorKey: block.getKey(),
        anchorOffset: 0,
        focusKey: block.getKey(),
        focusOffset: currentDraftText.length,
      }),
      newText
    )

    onDraftChange(EditorState.push(editorState, replaced, "change-block-data"))
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

    newContent !== drafttaskValues.body &&
      dispatch(setDrafttaskBody(newContent))
  }

  const disableEditorBlurTemporarily = () => {
    setTimeout(() => {
      disableEditorBlur = false
    }, 1)
  }

  const handleDueClicked = e => {
    setDueAnchorEl(e.currentTarget)
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

  const showCustomRepeat = () => {
    setCustomRepeatAncorEl(repeatAnchorEl)
  }

  return (
    <MuiThemeProvider theme={theme}>
      <div className={clsx([classes.root])}>
        <div className={clsx([classes.editorContainer])}>
          <Editor
            placeholder={"Type your task here \u2713"}
            ariaLabel="task input"
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
            className="draftjs-editir"
            handleReturn={() => "handled"}
          />
        </div>
        <ButtonGroupButton
          size="small"
          className={classes.submitButton}
          onClick={createtask}
        >
          <PlayArrowIcon color="primary" className={classes.playIcon} />
        </ButtonGroupButton>
        <div className={clsx([classes.rowFlex, classes.tools])}>
          <ButtonGroupButton
            size="small"
            onClick={e => {
              setRepeatAnchorEl(e.currentTarget)
            }}
            data-testid="repeat-button"
            {...keepDraftEvents}
          >
            <UpdateIcon
              className={drafttaskValues.repeat && classes.repeatSet}
              color="primary"
            />
          </ButtonGroupButton>
          <RepeatMenu
            anchorEl={repeatAnchorEl}
            onClose={() => setRepeatAnchorEl(false)}
            showCustomRepeat={showCustomRepeat}
          />
          <CustomRepeatPopover
            anchorEl={customRepeatAnchorEl}
            onClose={() => setCustomRepeatAncorEl(false)}
          />
          <ButtonGroupButton
            onClick={e => {
              setPriorityAnchorEl(e.currentTarget)
            }}
            data-testid="priority-button"
            size="small"
            {...keepDraftEvents}
          >
            <PriorityHighIcon
              color="primary"
              className={clsx({
                "priority-veryhigh": drafttaskValues.priority === 1,
                "priority-high": drafttaskValues.priority === 2,
                "priority-medium": drafttaskValues.priority === 3,
                "priority-low": drafttaskValues.priority === 4,
              })}
            />
          </ButtonGroupButton>
          <PriorityMenu
            anchorEl={priorityAnchorEl}
            onClose={() => setPriorityAnchorEl(false)}
          />
          <ButtonGroupButton
            size="small"
            {...keepDraftEvents}
            onClick={handleDueClicked}
            data-testid="due-button"
          >
            <DateRangeIcon
              color="primary"
              className={drafttaskValues.dueDate && classes.dueSet}
            />
          </ButtonGroupButton>
          <BasicDateTimePicker
            anchorEl={dueAnchorEl}
            onClose={() => setDueAnchorEl(false)}
          />
        </div>
      </div>
    </MuiThemeProvider>
  )
}

export default TaskInput

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    margin: theme.spacing(1, "auto"),
    marginBottom: theme.spacing(2.25),
    width: "90%",
    transition: "all 0.3s",
    overflowX: "hidden",
    border: props => `solid ${props.focus ? "2px #88b88895" : "1px #c4c4c4"}`,
  },
  rowFlex: {
    flexGrow: 1,
    display: "flex",
    margin: "2px 8px",
  },
  aroundCenter: {
    margin: "1rem",
    justifyContent: "space-around",
    alignItems: "center",
  },
  editorContainer: {
    backgroundColor: "#f1f2f195",
    margin: theme.spacing(0, "auto"),
    overflowX: "hidden",
    padding: theme.spacing(0.8, 1),
    caretColor: "black !important",
    wordBreak: "keep-all",
    paddingBottom: props =>
      props.focus ? theme.spacing(4.8) : theme.spacing(1),
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
  dueSet: {
    fill: "#fcd36e",
  },
  repeatSet: {
    fill: "#afddbf",
  },
}))
