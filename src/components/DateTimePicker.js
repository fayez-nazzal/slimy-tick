import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { DateTimePicker as MuiDateTimePicker } from '@material-ui/pickers';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ThemeProvider } from '@material-ui/core/styles';
import moment from 'moment';
import { connect, useDispatch } from 'react-redux';
import { Button, Popover } from '@material-ui/core';
import { minutes, hours, days } from 'time-convert';
import {
  findDueDateOptions,
  findDueTimeOptions,
  findRepeatOptions,
} from '../utils/regexAnalyzers';
import { setNewTaskDueDate, setNewTaskDueTime } from '../redux/newTask';
import {
  dueAnchorElIdSelector,
  dueTaskIdSelector,
  newTaskSelector,
  tasksSelector,
} from '../redux/selectors';
import { editTask } from '../redux/tasks';
import { setDueAnchorElId } from '../redux/dueAnchorElId';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#bedc9b',
    },
  },
});

const timeToDays = (repeatArr) => {
  const repeatFor = repeatArr && repeatArr[0];

  switch (repeatFor) {
    case 'minutes':
      return days.from(minutes)(repeatArr[1]);
    case 'hours':
      return days.from(hours)(repeatArr[1]);
    case 'days':
      return repeatArr[1];
    default:
      return null;
  }
};

const repeatArrToDays = (repeatArr) => {
  const repeatFor = repeatArr && repeatArr[0];

  switch (repeatFor) {
    case 'mornings':
    case 'afternoons':
    case 'evenings':
    case 'nights':
    case 'days':
      return ['days', repeatArr[1]];
    case 'daytimes':
    case 'times':
      return ['days', 1];
    case 'weeks':
      return ['days', repeatArr[1] * 7];
    default:
      return repeatArr;
  }
};

const useStyles = makeStyles({
  flex: {
    marginTop: '8px',
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
  button: {
    margin: '0 6px',
  },
});

const DateTimePicker = ({
  anchorElId, dueTaskId, taskValues,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState();
  const recurDates = useRef([]);
  useEffect(() => {
    const analyzedRepeat = findRepeatOptions(taskValues.repeat);

    const normalizedRepeat = repeatArrToDays(analyzedRepeat);
    // eslint-disable-next-line no-use-before-define
    setSelectedDate((prev) => (!selectedDate ? getDate() : prev));
    const eqDays = timeToDays(normalizedRepeat);

    if (
      normalizedRepeat &&
      !normalizedRepeat.weekdays &&
      selectedDate &&
      (!eqDays || eqDays > 1)
    ) {
      const currClone = selectedDate.clone();
      recurDates.current = [];

      // maximum generated dates = 800
      // as the number of days increases, the interval between each two dates increases
      // which means that the last date can be long after (may not bee seen by user)
      // generate less dates --> higher performance
      const dateCount = Math.floor(800 - eqDays * 100);

      for (let i = 0; i < dateCount; i += 1) {
        currClone.add(normalizedRepeat[1], normalizedRepeat[0]);

        recurDates.current.push(currClone.clone());
      }
    }
  }, [taskValues.repeat, selectedDate]);

  const setDueDate = (newDate) => {
    const action = dueTaskId === 'new' ? setNewTaskDueDate(newDate) : editTask({ ...taskValues, dueDate: newDate });
    dispatch(action);
  };

  const setDueTime = (newTime) => {
    const action = dueTaskId === 'new' ? setNewTaskDueTime(newTime) : editTask({ ...taskValues, dueTime: newTime });
    dispatch(action);
  };

  const onClose = () => {
    dispatch(setDueAnchorElId(null));
  };

  const handleOkButton = () => {
    const dateString = selectedDate.format('MMM DD, YYYY');
    const timeString = selectedDate.format('hh:mm a');
    setDueDate(dateString);
    setDueTime(timeString);
    onClose();
  };

  const handleAccept = (date) => {
    setSelectedDate(date);
  };

  const getDate = () => {
    const taskMomentDate = findDueDateOptions(taskValues.dueDate) || moment();
    const taskMomentTime = findDueTimeOptions(taskValues.dueTime) || moment();

    return taskMomentDate.set({
      hour: taskMomentTime.get('hour'),
      minute: taskMomentTime.get('minute'),
    });
  };

  const handleOnEnter = () => {
    setSelectedDate(getDate());
  };

  const renderDay = (day, selDate, _, DayComponent) => {
    const analyzedRepeat = findRepeatOptions(taskValues.repeat);
    const normalizedRepeat = repeatArrToDays(analyzedRepeat);

    const repeatToDays = selDate && timeToDays(normalizedRepeat);

    const renderCustom =
      normalizedRepeat &&
      ((repeatToDays && repeatToDays <= 1) ||
        recurDates.current.find((date) => date.isSame(day, 'day')) ||
        (normalizedRepeat[0] === 'weekdays' &&
          normalizedRepeat[1].find(
            (weekday) => day.format('ddd').toLowerCase() === weekday,
          ) !== undefined &&
          day.isAfter(selDate)));

    return (
      <CustomDay
        highlighted={renderCustom}
        component={DayComponent}
        day={day.format('D')}
      />
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Popover
        open={!!anchorElId}
        anchorEl={!!anchorElId && document.getElementById(anchorElId)}
        onClose={onClose}
        onEnter={handleOnEnter}
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MuiDateTimePicker
          variant="static"
          value={selectedDate}
          onChange={setSelectedDate}
          onAccept={handleAccept}
          renderDay={renderDay}
          rightArrowButtonProps={{
            'data-testid': 'datetimepicker-rightarrow',
          }}
          color="primary"
          disablePast
          minutesStep={5}
          autoOk
        />
        <div className={classes.flex}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleOkButton}
          >
            Ok
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </Popover>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => {
  const dueTaskId = dueTaskIdSelector(state);
  const taskValues = dueTaskId === 'new' ? newTaskSelector(state) : tasksSelector(state).find((task) => task.id === dueTaskId);
  const anchorElId = dueAnchorElIdSelector(state);

  return {
    dueTaskId,
    taskValues,
    anchorElId,
  };
};

export default connect(mapStateToProps, null, null)(DateTimePicker);

const CustomDay = (props) => {
  const [hovered, setHovered] = useState(false);

  return React.cloneElement(props.component, {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      boxShadow:
        props.highlighted &&
        `inset 0px 0px 0px 3px ${hovered ? '#bedeaf' : '#bedc9b95'}`,
    },
    'data-testid': `day-${props.day}`,
  });
};

DateTimePicker.propTypes = {
  anchorElId: PropTypes.string.isRequired,
  dueTaskId: PropTypes.string.isRequired,
  taskValues: PropTypes.shape({
    body: PropTypes.string,
    dueDate: PropTypes.string,
    dueTime: PropTypes.string,
    repeat: PropTypes.string,
  }).isRequired,
};

CustomDay.propTypes = {
  component: PropTypes.element,
};
