import React, { useState, useEffect } from 'react';
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
import { addTask } from '../redux/tasks';
import { setNewTaskPriority, setNewTaskBody } from '../redux/newTask';
import DateTimePicker from './DateTimePicker';
import ButtonGroupButton from './general/ButtonGroupIconButton';
import RepeatMenu from './menus/RepeatMenu';
import CustomRepeatPopover from './menus/CustomRepeatPopover';
import PriorityMenu from './menus/PriorityMenu';
import DraftTaskEditor from './DraftTaskEditor';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#80b640',
    },
  },
});

let disableEditorBlur = false;

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

  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    resetTask();
  }, []);

  const [priorityAnchorEl, setPriorityAnchorEl] = useState(false);
  const [dueAnchorEl, setDueAnchorEl] = useState(false);
  const [repeatAnchorEl, setRepeatAnchorEl] = useState(false);
  const [customRepeatAnchorEl, setCustomRepeatAncorEl] = useState(false);

  const classes = useStyles({ focus });
  const [createtask] = useMutation(CREATE_TASK, {
    update(proxy, { data: { createtask: newtask } }) {
      dispatch(addTask(newtask));
      // eslint-disable-next-line no-use-before-define
      dispatch(setNewTaskBody(''));
      // eslint-disable-next-line no-use-before-define
      resetTask();
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
      disableEditorBlur = false;
    }, 1);
  };

  const handleDueClicked = (e) => {
    setDueAnchorEl(e.currentTarget);
    disableEditorBlurTemporarily();
  };

  const keepDraftEvents = {
    onMouseEnter: () => {
      disableEditorBlur = true;
    },
    onMouseLeave: () => {
      disableEditorBlur = false;
    },
  };

  const showCustomRepeat = () => {
    setCustomRepeatAncorEl(repeatAnchorEl);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <div className={clsx([classes.root])}>
        <DraftTaskEditor disableBlur={disableEditorBlur} focus={focus} setFocus={setFocus} />
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
            onClose={() => setRepeatAnchorEl(false)}
            showCustomRepeat={showCustomRepeat}
          />
          <CustomRepeatPopover
            anchorEl={customRepeatAnchorEl}
            onClose={() => setCustomRepeatAncorEl(false)}
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
          />
          <ButtonGroupButton
            size="small"
            {...keepDraftEvents}
            onClick={handleDueClicked}
            data-testid="due-button"
          >
            <DateRangeIcon
              color="primary"
              className={newTask.dueDate && classes.dueSet}
            />
          </ButtonGroupButton>
          <DateTimePicker
            anchorEl={dueAnchorEl}
            onClose={() => setDueAnchorEl(false)}
          />
        </div>
      </div>
    </MuiThemeProvider>
  );
};

const mapStateToProps = (state) => ({
  newTask: newTaskSelector(state),
});

export default connect(mapStateToProps)(newTaskInput);
