import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankSharpIcon from '@material-ui/icons/CheckBoxOutlineBlankSharp';
import CheckBoxSharpIcon from '@material-ui/icons/CheckBoxSharp';
import MoreHorizSharpIcon from '@material-ui/icons/MoreHorizSharp';
import IconButton from '@material-ui/core/IconButton';
import { Button } from '@material-ui/core';
import { connect, useDispatch } from 'react-redux';
import moment from 'moment';
import clsx from 'clsx';
import EditTaskMenu from './menus/EditTaskMenu';
import { findDueDateOptions, findDueTimeOptions } from '../utils/regexAnalyzers';
import { activeGroupSelector } from '../redux/selectors';
import { setTaskBody, removeTask } from '../redux/tasks';
import { setActiveTaskId } from '../redux/activeTaskId';
import { setPriorityAnchorId, setDueAnchorId } from '../redux/anchorIds';

const useStyles = makeStyles({
  input: {
    border: 'none !important',
    backgroundColor: 'transparent !important',
    outline: 'none !important',
    height: '100%',
    fontSize: '16px',
    width: '100%',
  },
  dueStr: {
    color: '#2ec4b6',
    textTransform: 'none',
  },
});

const Task = ({
  checked, body, priority, groupName, _id, dueDate, dueTime, repeat,
}) => {
  const classes = useStyles();
  const [editMenuAnchorId, setEditMenuAnchorId] = useState(null);
  const [dueStr, setDueStr] = useState(null);
  const [priorityStr, setPriorityStr] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    console.debug('task rendered');
  });

  useEffect(() => {
    console.log(dueDate);
    const momentDueDate = findDueDateOptions(dueDate);
    if (momentDueDate && momentDueDate.isValid()) {
      let newDueStr;

      const momentDueTime = findDueTimeOptions(dueTime);
      if (momentDueTime && momentDueTime.isValid()) {
        momentDueDate.set({
          hour: momentDueTime.get('hour'),
          minute: momentDueTime.get('minute'),
          second: momentDueTime.get('second'),
        });
      }

      if (momentDueDate.isSame(moment().add('days', 1), 'day')) {
        newDueStr = 'tomorrow';
      } else if (momentDueDate.isBefore(moment)) {
        newDueStr = 'overdue';
      } else {
        newDueStr = momentDueDate.format('MMM Do hh:mm a');
      }

      console.log(newDueStr);

      setDueStr(newDueStr);
    }
  }, [dueDate, dueTime]);

  useEffect(() => {
    setPriorityStr((priority === 1 && '!!! Very high') || (priority === 2 && '!! High') || (priority === 3 && '! Medium'));
  }, [priority]);

  const onBodyChange = (e) => {
    dispatch(setTaskBody({
      id: _id,
      newBody: e.target.value,
    }));
  };

  const setAsActiveTask = () => {
    dispatch(setActiveTaskId(_id));
  };

  const onHorizButton = (e) => {
    setEditMenuAnchorId(e.currentTarget.id);
    setAsActiveTask();
  };

  const onPriorityStr = (e) => {
    dispatch(setPriorityAnchorId(e.currentTarget.id));
    setAsActiveTask();
  };

  const onDueStr = (e) => {
    dispatch(setDueAnchorId(e.currentTarget.id));
    setAsActiveTask();
  };

  const remove = () => {
    dispatch(removeTask({ groupName, taskId: _id }));
  };

  return (
    <ListItem dense divider>
      <ListItemIcon>
        <Checkbox
          edge="start"
          color="primary"
          checked={checked}
          checkedIcon={<CheckBoxSharpIcon />}
          icon={<CheckBoxOutlineBlankSharpIcon />}
        />
      </ListItemIcon>
      <input
        value={body}
        onChange={onBodyChange}
        variant="filled"
        className={classes.input}
      />
      <ListItemSecondaryAction>
        {priorityStr && (
        <Button
          size="small"
          id={`taskPriority${_id}`}
          className={clsx({
            'priority-veryhigh': priority === 1,
            'priority-high': priority === 2,
            'priority-medium': priority === 3,
          })}
          onClick={onPriorityStr}
        >
          {priorityStr}
        </Button>
        )}
        {dueStr && (
        <Button className={classes.dueStr} id={`taskDueDate${_id}`} onClick={onDueStr}>
          {dueStr}
        </Button>
        )}
        <IconButton id={`editTaskButton${_id}`} onClick={onHorizButton}>
          <MoreHorizSharpIcon color="info" />
        </IconButton>
        <EditTaskMenu
          taskId={_id}
          onClose={() => setEditMenuAnchorId(null)}
          anchorId={editMenuAnchorId}
          removeTask={remove}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const mapStateToProps = (state) => ({
  groupName: activeGroupSelector(state).name,
});

export default connect(mapStateToProps)(Task);

Task.propTypes = {
  checked: PropTypes.bool.isRequired,
  body: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  // created: PropTypes.string.isRequired,
  priority: PropTypes.number.isRequired,
  dueDate: PropTypes.string.isRequired,
  dueTime: PropTypes.string.isRequired,
  repeat: PropTypes.string.isRequired,
};
