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
import IconButton from "@material-ui/core/IconButton"
import Select from "@material-ui/core/Select"
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
  setDraftTodoRepeat,
} from "../redux/user"
import DraftStrategyComponent from "./DraftStrategyComponent"
import {
  matchDueDate,
  matchDueTime,
  matchRepeat,
  matchRemind,
  matchPriorityAndReturnRange,
} from "../utils/matchers"
import {
  Button,
  MenuItem,
  Popover,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core"
import ListItemText from "@material-ui/core/ListItemText"
import Menu from "./Menu"
import BasicDateTimePicker from "./DateTimePicker"
import { findRepeatOptions } from "../utils/regexAnalyzers"
import ToggleButton from "@material-ui/lab/ToggleButton"
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#80b640",
    },
  },
})

const popoverTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#bedc9b",
    },
  },
  overrides: {
    MuiPopover: {
      paper: {
        border: "1px solid #d3d4d5",
        borderRadius: "4px",
        transition: "none",
        padding: "8px",
      },
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

  useEffect(() => {
    const currentDraftText = editorState
      .getCurrentContent()
      .getPlainText("\u0001")

    if (draftTodoValues.body !== currentDraftText) {
      setDraftBodyText(draftTodoValues.body)
    }
  }, [draftTodoValues.body])

  const currentGroup = useSelector(
    state => state.user.userData.groups[state.user.groupIndex]
  )

  const [focus, setFocus] = useState(false)
  const editorRef = useRef(null)
  const [priorityAnchorEl, setPriorityAnchorEl] = useState(false)
  const [dueAnchorEl, setDueAnchorEl] = useState(false)
  const [repeatAnchorEl, setRepeatAnchorEl] = useState(false)
  const [customRepeatAnchorEl, setCustomRepeatAncorEl] = useState(false)
  const [customRepeatOption, setCustomRepeatOption] = useState({
    every: "days",
    value: 2,
  })
  const [repeatWeekdays, setRepeatWeekdays] = useState([])

  useEffect(() => {
    if (draftTodoValues.repeat) {
      const analyzedRepeat = findRepeatOptions(draftTodoValues.repeat)
      setRepeatWeekdays(prev =>
        analyzedRepeat[0] === "weekdays" ? analyzedRepeat[1] : prev
      )
      setCustomRepeatOption({
        every: analyzedRepeat[0],
        value: analyzedRepeat[1],
      })
    }
  }, [draftTodoValues.repeat])

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

  const setDraftBodyText = newText => {
    const currentDraftText = editorState
      .getCurrentContent()
      .getPlainText("\u0001")

    const selection = editorState.getSelection()
    const contentState = editorState.getCurrentContent()
    const block = contentState.getBlockForKey(selection.getAnchorKey())

    // this is not the best way to replace
    // but i think it wont impact performance, most todos text is short
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

  const handleRepeatWeekdaysChange = (_, newWeekdays) => {
    setCustomRepeatOption({
      every: "weekdays",
      value: newWeekdays,
    })
    setRepeatWeekdays(newWeekdays)
  }

  const handleCustomRepeatOptionChange = (e, changedValue) => {
    setRepeatWeekdays([])
    setCustomRepeatOption(prev => ({
      every: changedValue === "every" ? e.target.value : prev.every,
      value:
        changedValue === "value" ? e.target.value : parseInt(prev.value) || 2,
    }))
  }

  const handleRepeatPopoverClose = () => {
    setCustomRepeatAncorEl(false)
  }

  const handleRepeatPopoverAccept = () => {
    setCustomRepeatAncorEl(false)
    repeatWeekdays.length &&
      dispatch(setDraftTodoRepeat(`every ${repeatWeekdays.join(", ")}`))
    customRepeatOption.every &&
      parseInt(customRepeatOption.value) > 0 &&
      dispatch(
        setDraftTodoRepeat(
          `every ${customRepeatOption.value} ${customRepeatOption.every}`
        )
      )
  }

  return (
    <MuiThemeProvider theme={theme}>
      <div className={clsx([classes.root])}>
        <div className={clsx([classes.editorContainer])}>
          <Editor
            placeholder={"Type your task here \u2713"}
            ariaLabel="todo input"
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
        <IconButton
          size="small"
          className={classes.submitButton}
          onClick={createTodo}
        >
          <PlayArrowIcon color="primary" className={classes.playIcon} />
        </IconButton>
        <div className={clsx([classes.rowFlex, classes.tools])}>
          <IconButton
            size="small"
            onClick={e => {
              setRepeatAnchorEl(e.currentTarget)
            }}
            data-testid="repeat-button"
            {...keepDraftEvents}
          >
            <UpdateIcon
              className={draftTodoValues.repeat && classes.repeatSet}
              color="primary"
            />
          </IconButton>
          <Menu
            anchorEl={repeatAnchorEl}
            onClose={() => setRepeatAnchorEl(false)}
          >
            <MenuItem onClick={() => dispatch(setDraftTodoRepeat("every day"))}>
              <ListItemText primary="Every day" />
            </MenuItem>
            <MenuItem
              onClick={() => dispatch(setDraftTodoRepeat("every week"))}
            >
              <ListItemText primary="Every week" />
            </MenuItem>
            <MenuItem
              data-testid="menuitem-priority-medium"
              onClick={() => dispatch(setDraftTodoRepeat("every month"))}
            >
              <ListItemText primary="Every month" />
            </MenuItem>
            <MenuItem onClick={() => setCustomRepeatAncorEl(repeatAnchorEl)}>
              <ListItemText primary="Custom" />
            </MenuItem>
          </Menu>
          <ThemeProvider theme={popoverTheme}>
            <Popover
              anchorEl={customRepeatAnchorEl}
              onClose={handleRepeatPopoverClose}
              open={!!customRepeatAnchorEl}
              aria-haspopup="true"
              aria-controls="custom-repeat-popup"
              elevation={0}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <div aria-label="weekdays options">
                <ToggleButtonGroup
                  value={repeatWeekdays}
                  onChange={handleRepeatWeekdaysChange}
                  aria-label="repeat weekdays"
                  size="small"
                >
                  <ToggleButton value="sun" aria-label="sunday">
                    <Typography variant="caption">Sun</Typography>
                  </ToggleButton>
                  <ToggleButton value="mon" aria-label="monday">
                    <Typography variant="caption">Mon</Typography>
                  </ToggleButton>
                  <ToggleButton value="tue" aria-label="tuesday">
                    <Typography variant="caption">Tue</Typography>
                  </ToggleButton>
                  <ToggleButton value="wed" aria-label="wednesday">
                    <Typography variant="caption">Wed</Typography>
                  </ToggleButton>
                  <ToggleButton value="thu" aria-label="thursday">
                    <Typography variant="caption">Thu</Typography>
                  </ToggleButton>
                  <ToggleButton value="fri" aria-label="friday">
                    <Typography variant="caption">Fri</Typography>
                  </ToggleButton>
                  <ToggleButton value="sat" aria-label="saturday">
                    <Typography variant="caption">Sat</Typography>
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
              <div className={clsx([classes.rowFlex, classes.aroundCenter])}>
                <Typography variant="body1">Every</Typography>
                <TextField
                  value={customRepeatOption.value}
                  onChange={e => handleCustomRepeatOptionChange(e, "value")}
                  type={
                    ["times", "weekdays"].includes(customRepeatOption.every)
                      ? "text"
                      : "number"
                  }
                  disabled={["times", "weekdays"].includes(
                    customRepeatOption.every
                  )}
                  className={classes.repeatNumInput}
                />
                <Select
                  labelId="custom-repeat-option-select-label"
                  id="custom-repeat-option-select"
                  value={customRepeatOption.every}
                  onChange={e => handleCustomRepeatOptionChange(e, "every")}
                  className={classes.repeatEverySelect}
                >
                  <MenuItem value="minutes">Minutes</MenuItem>
                  <MenuItem value="hours">Hours</MenuItem>
                  <MenuItem value="days">Days</MenuItem>
                  <MenuItem value="weeks">Weeks</MenuItem>
                  <MenuItem value="months">Months</MenuItem>
                  <MenuItem value="years">Years</MenuItem>
                  <MenuItem value="mornings" className={classes.hidden}>
                    Mornings
                  </MenuItem>
                  <MenuItem value="afternoons" className={classes.hidden}>
                    Afternoons
                  </MenuItem>
                  <MenuItem value="evenings" className={classes.hidden}>
                    Evenings
                  </MenuItem>
                  <MenuItem value="nights" className={classes.hidden}>
                    Nights
                  </MenuItem>
                  <MenuItem value="times" className={classes.hidden}>
                    Times
                  </MenuItem>
                  <MenuItem value="weekdays" className={classes.hidden}>
                    Weekdays
                  </MenuItem>
                </Select>
              </div>
              <div className={clsx(classes.rowFlex, classes.aroundCenter)}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRepeatPopoverClose}
                >
                  CANCEL
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRepeatPopoverAccept}
                >
                  OK
                </Button>
              </div>
            </Popover>
          </ThemeProvider>
          <IconButton
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
                "priority-veryhigh": draftTodoValues.priority === 1,
                "priority-high": draftTodoValues.priority === 2,
                "priority-medium": draftTodoValues.priority === 3,
                "priority-low": draftTodoValues.priority === 4,
              })}
            />
          </IconButton>
          <Menu
            anchorEl={priorityAnchorEl}
            onClose={() => setPriorityAnchorEl(false)}
          >
            <MenuItem onClick={() => dispatch(setDraftTodoPriority(1))}>
              <Typography
                variant="h6"
                component="subtitle1"
                className="priority-veryhigh"
              >
                !!!{" "}
              </Typography>
              <ListItemText primary="Very high" />
            </MenuItem>
            <MenuItem onClick={() => dispatch(setDraftTodoPriority(2))}>
              <Typography
                variant="h6"
                component="subtitle1"
                className="priority-high"
              >
                !!{" "}
              </Typography>
              <ListItemText primary=" High" />
            </MenuItem>
            <MenuItem
              data-testid="menuitem-priority-medium"
              onClick={() => dispatch(setDraftTodoPriority(3))}
            >
              <Typography
                variant="h6"
                component="subtitle1"
                className="priority-medium"
              >
                !{" "}
              </Typography>
              <ListItemText primary="Medium" />
            </MenuItem>
            <MenuItem onClick={() => dispatch(setDraftTodoPriority(4))}>
              <ListItemText primary="Low" />
            </MenuItem>
          </Menu>
          <IconButton
            size="small"
            {...keepDraftEvents}
            onClick={handleDueClicked}
            data-testid="due-button"
          >
            <DateRangeIcon
              color="primary"
              className={draftTodoValues.dueDate && classes.dueSet}
            />
          </IconButton>
          <BasicDateTimePicker
            anchorEl={dueAnchorEl}
            onClose={() => setDueAnchorEl(false)}
          />
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
  repeatNumInput: {
    width: "5.8rem",
    marginLeft: "0.8rem",
  },
  repeatEverySelect: {
    width: "6.8rem",
    marginLeft: "0.8rem",
  },
  hidden: {
    display: "none",
  },
}))
