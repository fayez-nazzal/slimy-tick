import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import {
  MenuItem,
  TextField,
  Typography,
  Popover,
  Button,
} from '@material-ui/core';
import { connect, useDispatch } from 'react-redux';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import clsx from 'clsx';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider } from '@material-ui/core/styles';
import { findRepeatOptions } from '../../utils/regexAnalyzers';
import {
  anchorIdsSelector, activeTaskIdSelector, newTaskSelector, tasksSelector,
} from '../../redux/selectors';
import { setCustomRepeatAnchorId } from '../../redux/anchorIds';
import { setNewTaskRepeat } from '../../redux/newTask';
import { setTaskRepeat } from '../../redux/tasks';

const popoverTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#bedc9b',
    },
  },
  overrides: {
    MuiPopover: {
      paper: {
        border: '1px solid #d3d4d5',
        borderRadius: '4px',
        transition: 'none',
        padding: '8px',
      },
    },
  },
});

const useStyles = makeStyles({
  rowFlex: {
    flexGrow: 1,
    display: 'flex',
    margin: '2px 8px',
  },
  aroundCenter: {
    margin: '1rem',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  repeatNumInput: {
    width: '5.8rem',
    marginLeft: '0.8rem',
  },
  repeatEverySelect: {
    width: '6.8rem',
    marginLeft: '0.8rem',
  },
  hidden: {
    display: 'none',
  },
});

const CustomRepeatPopover = ({
  anchorId, activeTaskId, taskValues,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [stepOption, setStepOption] = useState({
    every: 'days',
    value: 2,
  });
  const [weekdays, setWeekdays] = useState([]);

  useEffect(() => {
    if (taskValues && taskValues.repeat) {
      const analyzedRepeat = findRepeatOptions(taskValues.repeat);
      setWeekdays((prev) => (analyzedRepeat[0] === 'weekdays' ? analyzedRepeat[1] : prev));
      setStepOption({
        every: analyzedRepeat[0],
        value: analyzedRepeat[1],
      });
    }
  }, [taskValues && taskValues.repeat]);

  const onWeekdaysChange = (_, newWeekdays) => {
    setStepOption({
      every: 'weekdays',
      value: newWeekdays,
    });
    setWeekdays(newWeekdays);
  };

  const onStepOptionChange = (e, changedValue) => {
    setWeekdays([]);
    setStepOption((prev) => ({
      every: changedValue === 'every' ? e.target.value : prev.every,
      value:
        changedValue === 'value' ? e.target.value : parseInt(prev.value, 10) || 2,
    }));
  };

  const onClose = () => {
    dispatch(setCustomRepeatAnchorId(''));
  };

  const handleRepeatPopoverClose = () => {
    onClose();
  };

  const setRepeat = (newRepeat) => {
    const action = activeTaskId === 'new' ? setNewTaskRepeat(newRepeat) : setTaskRepeat({ id: activeTaskId, newRepeat });
    dispatch(action);
  };

  const handleRepeatPopoverAccept = () => {
    onClose();
    if (weekdays.length) setRepeat(`every ${weekdays.join(', ')}`);
    if (stepOption.every && stepOption.value > 0) {
      setRepeat(`every ${stepOption.value} ${stepOption.every}`);
    }
  };

  return (
    <ThemeProvider theme={popoverTheme}>
      <Popover
        anchorEl={!!anchorId && document.getElementById(anchorId)}
        onClose={onClose}
        open={!!anchorId}
        aria-haspopup="true"
        aria-controls="custom-repeat-popup"
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
        <div aria-label="weekdays options">
          <ToggleButtonGroup
            value={weekdays}
            onChange={onWeekdaysChange}
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
            value={stepOption.value}
            onChange={(e) => onStepOptionChange(e, 'value')}
            type={
              ['times', 'weekdays'].includes(stepOption.every)
                ? 'text'
                : 'number'
            }
            disabled={['times', 'weekdays'].includes(stepOption.every)}
            className={classes.repeatNumInput}
          />
          <Select
            labelId="custom-repeat-option-select-label"
            id="custom-repeat-option-select"
            value={stepOption.every}
            onChange={(e) => onStepOptionChange(e, 'every')}
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
  );
};

const mapStateToProps = (state) => {
  const activeTaskId = activeTaskIdSelector(state);
  const taskValues = activeTaskId === 'new' ? newTaskSelector(state) : tasksSelector(state).find((task) => task._id === activeTaskId);
  const anchorId = anchorIdsSelector(state).customRepeatId;

  return {
    activeTaskId,
    taskValues,
    anchorId,
  };
};

export default connect(mapStateToProps)(CustomRepeatPopover);

CustomRepeatPopover.propTypes = {
  activeTaskId: PropTypes.string.isRequired,
  anchorId: PropTypes.string.isRequired,
  taskValues: PropTypes.shape({
    repeat: PropTypes.string,
  }).isRequired,
};
