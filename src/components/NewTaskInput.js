import React, { useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import 'draft-js/dist/Draft.css';
import clsx from 'clsx';
import PriorityHighIcon from '@material-ui/icons/PriorityHighSharp';
import DateRangeIcon from '@material-ui/icons/DateRangeSharp';
import UpdateIcon from '@material-ui/icons/UpdateSharp';
import PlayArrowIcon from '@material-ui/icons/PlayArrowSharp';
import { useMutation } from '@apollo/client';
import { useDispatch, connect } from 'react-redux';
import { CREATE_TASK } from '../apollo/queries';
import { newTaskSelector } from '../redux/selectors';
import {
  setNewTaskRepeat,
  setNewTaskPriority,
  setNewTaskBody,
} from '../redux/newTask';
import { addNewTask } from '../redux/tasks';
import ButtonGroupButton from './general/ButtonGroupIconButton';
import RepeatMenu from './menus/RepeatMenu';
import CustomRepeatPopover from './menus/CustomRepeatPopover';
import PriorityMenu from './menus/PriorityMenu';
import DraftTaskEditor from './DraftTaskEditor';
import { setDueAnchorEl } from '../redux/dueAnchorEl';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#80b640',
    },
  },
});

const useStyles = makeStyles({
  root: {
    position: 'relative',
    margin: theme.spacing(1, 'auto'),
    marginBottom: theme.spacing(2.25),
    width: '90%',
    transition: 'all 0.3s',
    overflowX: 'hidden',
    border: (props) => `solid ${props.focus ? '2px #88b88895' : '1px #c4c4c4'}`,
  },
  submitButton: {
    zIndex: '1000',
    position: 'absolute',
    right: '0.1rem',
    top: 0,
    bottom: 0,
    transform: (props) => (props.focus ? 'scaleX(1)' : 'scaleX(0)'),
    transition: 'all 0.1s ease-in-out 0.1s',
    cursor: 'pointer',
  },
  playIcon: {
    width: '2.4rem',
    height: '2.4rem',
  },
  tools: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    transform: (props) => (props.focus ? 'scaleX(1)' : 'scaleX(0)'),
    opacity: (props) => (props.focus ? 1 : 0),
    transition: 'transform 0.1s ease-in-out, opacity 0.4s ease-in-out 0.1s',
  },
  toolIcon: {
    display: 'none',
    transition: 'all 0.3s',
  },
  activeToolIcon: {
    transition: 'all 0.3s',
  },
  dueSet: {
    fill: '#fcd36e',
  },
  repeatSet: {
    fill: '#afddbf',
  },
});

const newTaskInput = ({ newTask }) => {
  const dispatch = useDispatch();
  const [focus, setFocus] = useState(false);
  const disableEditorBlur = useRef(false);
  const [mutationVariables, setMutationVariables] = useState();
  const dueRef = useRef(null);
  useEffect(() => {
    console.debug('new task input rendered');
    // eslint-disable-next-line no-use-before-define
    resetTask();
  }, []);

  const [priorityAnchorEl, setPriorityAnchorEl] = useState(null);
  const [repeatAnchorEl, setRepeatAnchorEl] = useState(null);
  const [customRepeatAnchorEl, setCustomRepeatAncorEl] = useState(null);

  const classes = useStyles({ focus });
  const [addTaskMutation] = useMutation(CREATE_TASK, {
    update(proxy, { data: { addTask: newtask } }) {
      dispatch(setNewTaskBody(''));
    },
    onError(err) {
      console.log(JSON.stringify(err, null, 2));
    },
    variables: newTask,
  });

  // sets task with empty body, low priority
  const resetTask = () => {
    dispatch(setNewTaskBody(''));
    dispatch(setNewTaskPriority(4));
  };

  const disableEditorBlurTemporarily = () => {
    setTimeout(() => {
      disableEditorBlur.current = false;
    }, 1);
  };

  const addTask = () => {
    setMutationVariables(newTask);
    resetTask();
    dispatch(addNewTask(newTask));
    addTaskMutation();
  };

  const handleDueClicked = (e) => {
    console.log(dueRef);
    const target = e.currentTarget;
    const { id } = target;
    dispatch(setDueAnchorEl(id));
    disableEditorBlurTemporarily();
  };

  const keepDraftEvents = {
    onMouseEnter: () => {
      disableEditorBlur.current = true;
    },
    onMouseLeave: () => {
      disableEditorBlur.current = false;
    },
  };

  const showCustomRepeat = () => {
    setCustomRepeatAncorEl(repeatAnchorEl);
  };

  const setPriority = (newPriority) => {
    dispatch(setNewTaskPriority(newPriority));
  };

  const setRepeat = (newRepeat) => {
    dispatch(setNewTaskRepeat(newRepeat));
  };

  return (
    <MuiThemeProvider theme={theme}>
      <div className={clsx([classes.root])}>
        <DraftTaskEditor
          disableBlur={disableEditorBlur}
          focus={focus}
          setFocus={setFocus}
        />
        <ButtonGroupButton
          size="small"
          className={classes.submitButton}
          onClick={addTask}
          {...keepDraftEvents}
        >
          <PlayArrowIcon color="primary" className={classes.playIcon} />
        </ButtonGroupButton>
        <div className={clsx([classes.rowFlex, classes.tools])}>
          <ButtonGroupButton
            size="small"
            onClick={(e) => {
              setRepeatAnchorEl(e.currentTarget);
            }}
            data-testid="repeat-button"
            {...keepDraftEvents}
          >
            <UpdateIcon
              className={newTask.repeat && classes.repeatSet}
              color="primary"
            />
          </ButtonGroupButton>
          <RepeatMenu
            anchorEl={repeatAnchorEl}
            onClose={() => setRepeatAnchorEl(null)}
            showCustomRepeat={showCustomRepeat}
            setTaskRepeat={setRepeat}
          />
          <CustomRepeatPopover
            anchorEl={customRepeatAnchorEl}
            onClose={() => setCustomRepeatAncorEl(null)}
            taskRepeat={newTask.repeat}
            setTaskRepeat={setRepeat}
          />
          <ButtonGroupButton
            onClick={(e) => {
              setPriorityAnchorEl(e.currentTarget);
            }}
            data-testid="priority-button"
            size="small"
            {...keepDraftEvents}
          >
            <PriorityHighIcon
              color="primary"
              className={clsx({
                'priority-veryhigh': newTask.priority === 1,
                'priority-high': newTask.priority === 2,
                'priority-medium': newTask.priority === 3,
                'priority-low': newTask.priority === 4,
              })}
            />
          </ButtonGroupButton>
          <PriorityMenu
            anchorEl={priorityAnchorEl}
            onClose={() => setPriorityAnchorEl(false)}
            setTaskPriority={setPriority}
          />
          <ButtonGroupButton
            size="small"
            {...keepDraftEvents}
            onClick={handleDueClicked}
            data-testid="due-button"
            id="newTaskDueButton"
          >
            <DateRangeIcon
              color="primary"
              className={newTask.dueDate && classes.dueSet}
            />
          </ButtonGroupButton>
        </div>
      </div>
    </MuiThemeProvider>
  );
};

const mapStateToProps = (state) => ({
  newTask: newTaskSelector(state),
});

export default connect(mapStateToProps)(newTaskInput);
