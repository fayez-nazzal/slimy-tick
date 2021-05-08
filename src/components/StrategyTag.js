/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import {
  setNewTaskDueDate,
  setNewTaskDueTime,
  setNewTaskPriority,
  setNewTaskRepeat,
} from '../redux/newTask';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2dc065',
    },
    secondary: {
      main: '#bedc9b',
    },
  },
});

const useStyles = makeStyles({
  fullColored: {
    padding: (props) => props.theme.spacing(0, 0.3),
    margin: (props) => props.theme.spacing(0, 0.3),
    fontWeight: 'bold',
    backgroundColor: (props) => clsx({
      '#ffb70390': props.dueDate,
      '#ff790090': props.dueTime,
      '#4895ef90': props.remind,
      '#76c89390': props.repeat,
    }),
  },
  textColored: {
    padding: (props) => props.theme.spacing(0.2, 0.2),
    margin: (props) => props.theme.spacing(0, 0.1),
    fontWeight: 'bolder',
  },
});

const StrategyTag = (props) => {
  const dispatch = useDispatch();

  const classes = useStyles({
    ...props,
    theme,
  });

  useEffect(() => {
    const textContent = props.children[0].props.text.trim();
    props.priority &&
      dispatch(setNewTaskPriority(4 - textContent.length));
    props.dueDate && dispatch(setNewTaskDueDate(textContent));
    props.dueTime && dispatch(setNewTaskDueTime(textContent));
    props.repeat && dispatch(setNewTaskRepeat(textContent));
  }, [props.children]);

  useEffect(
    () => () => {
      props.priority && dispatch(setNewTaskPriority(4));
      props.dueDate && dispatch(setNewTaskDueDate(null));
      props.dueTime && dispatch(setNewTaskDueTime(''));
      props.repeat && dispatch(setNewTaskRepeat(''));
    },
    [],
  );

  const textContent = props.children[0].props.text.trim();
  const priority = props.priority && 4 - textContent.length;
  const { length } = props.children[0].props.text;

  const getTestId = () => {
    if (props.priority) return `draft-priority-${priority}`;
    if (props.dueDate) return 'draft-duedate';
    if (props.dueTime) return 'draft-duetime';
    if (props.repeat) return 'draft-repeat';
    return '';
  };

  return (
    <span
      className={clsx({
        [classes.textColored]: props.priority,
        'priority-veryhigh': props.priority && length === 3,
        'priority-high': props.priority && length === 2,
        'priority-medium': props.priority && length === 1,
        [classes.fullColored]: !props.priority,
      })}
      data-testid={getTestId()}
    >
      {props.children}
    </span>
  );
};

export default StrategyTag;

StrategyTag.propTypes = {
  children: PropTypes.element.isRequired,
  priority: PropTypes.bool,
  dueDate: PropTypes.bool,
  dueTime: PropTypes.bool,
  repeat: PropTypes.bool,
};

StrategyTag.defaultProps = {
  priority: false,
  dueDate: false,
  dueTime: false,
  repeat: false,
};
