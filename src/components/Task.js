import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles, createMuiTheme, ThemeProvider, useTheme,
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
import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import EditTaskMenu from './menus/EditTaskMenu';
import { findDueDateOptions, findDueTimeOptions } from '../utils/regexAnalyzers';
import { activeGroupSelector } from '../redux/selectors';
import { editTask } from '../redux/tasks';
import { EDIT_TASK } from '../apollo/queries';
import { setDueAnchorElId } from '../redux/dueAnchorElId';
import { setPriorityAnchorId } from '../redux/anchorIds';

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
    color: '#e9c46a',
    textTransform: 'none',
  },
});

const Task = ({
  checked, body, priority, groupName, _id, dueDate, dueTime, repeat,
}) => {
  const classes = useStyles();
  const [editMenuAnchorId, setEditMenuAnchorId] = useState(null);
  const [dueAnchorEl, setDueAnchorEl] = useState(null);
  const [dueStr, setDueStr] = useState(null);
  const [priorityStr, setPriorityStr] = useState(null);
  const [mutationVariables, setMutationVariables] = useState();
  const dispatch = useDispatch();

  const [editTaskMutation] = useMutation(EDIT_TASK, {
    update() {
    },
    onError(err) {
      console.log(JSON.stringify(err, null, 2));
    },
    variables: mutationVariables,
  });

  useEffect(() => {
    console.debug('task rendered');
  });

  useEffect(() => {
    editTaskMutation();
  }, [mutationVariables]);

  useEffect(() => {
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
        newDueStr = momentDueDate.format('MMM do hh:mm a');
      }

      setDueStr(newDueStr);
    }

    setPriorityStr('!'.repeat(4 - priority));
  }, []);

  const onBodyChange = (e) => {
    const newValues = {
      checked,
      body: e.target.value,
      priority,
      dueDate,
      dueTime,
      repeat,
    };

    setMutationVariables({ ...newValues, taskId: _id, groupName });

    dispatch(editTask({
      id: _id,
      newValues,
    }));
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
          size="large"
          className={clsx({
            'priority-veryhigh': priority === 1,
            'priority-high': priority === 2,
            'priority-medium': priority === 3,
          })}
          onClick={(e) => dispatch(setPriorityAnchorId(e.currentTarget.id))}
        >
          {priorityStr}
        </Button>
        )}
        {dueStr && (
        <Button className={classes.dueStr} id={`taskDueDate${_id}`} onClick={(e) => dispatch(setDueAnchorElId(e.currentTarget.id))}>
          {dueStr}
        </Button>
        )}
        <IconButton id={`editTaskButton${_id}`} onClick={(e) => setEditMenuAnchorId(e.currentTarget.id)}>
          <MoreHorizSharpIcon color="info" />
        </IconButton>
        <EditTaskMenu
          taskId={_id}
          onClose={() => setEditMenuAnchorId(null)}
          anchorId={editMenuAnchorId}
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
