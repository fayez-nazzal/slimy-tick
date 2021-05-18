import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import { connect, useDispatch } from 'react-redux';
import Menu from '../general/Menu';
import {
  anchorIdsSelector, dueTaskIdSelector, newTaskSelector, tasksSelector,
} from '../../redux/selectors';
import { setCustomRepeatAnchorId, setRepeatAnchorId } from '../../redux/anchorIds';
import { setNewTaskRepeat } from '../../redux/newTask';
import { editTask } from '../../redux/tasks';

const RepeatMenu = ({
  activeTaskId, anchorId, taskValues,
}) => {
  const dispatch = useDispatch();

  const setRepeat = (newRepeat) => {
    const action = activeTaskId === 'new' ? setNewTaskRepeat(newRepeat) : editTask({
      id: activeTaskId,
      newValues: {
        ...taskValues,
        repeat: newRepeat,
      },
    });
    dispatch(action);
  };

  const onClose = () => {
    dispatch(setRepeatAnchorId(''));
  };

  const showCustomRepeat = () => {
    dispatch(setCustomRepeatAnchorId(anchorId));
  };

  return (
    <Menu anchorEl={!!anchorId && document.getElementById(anchorId)} onClose={onClose}>
      <MenuItem onClick={() => setRepeat('every day')}>
        <ListItemText primary="Every day" />
      </MenuItem>
      <MenuItem onClick={() => setRepeat('every week')}>
        <ListItemText primary="Every week" />
      </MenuItem>
      <MenuItem
        data-testid="menuitem-priority-medium"
        onClick={() => setRepeat('every month')}
      >
        <ListItemText primary="Every month" />
      </MenuItem>
      <MenuItem onClick={showCustomRepeat}>
        <ListItemText primary="Custom" />
      </MenuItem>
    </Menu>
  );
};

const mapStateToProps = (state) => {
  const activeTaskId = dueTaskIdSelector(state);
  const taskValues = activeTaskId === 'new' ? newTaskSelector(state) : tasksSelector(state).find((task) => task.id === activeTaskId);
  const anchorId = anchorIdsSelector(state).repeatId;

  return {
    activeTaskId,
    taskValues,
    anchorId,
  };
};

export default connect(mapStateToProps)(RepeatMenu);

RepeatMenu.propTypes = {
  activeTaskId: PropTypes.string.isRequired,
  anchorId: PropTypes.string.isRequired,
  taskValues: PropTypes.shape({
    priority: PropTypes.string,
  }).isRequired,
};
