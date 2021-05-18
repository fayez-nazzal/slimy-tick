import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import { connect, useDispatch } from 'react-redux';
import Menu from '../general/Menu';
import { anchorIdsSelector, activeTaskIdSelector } from '../../redux/selectors';
import {
  setCustomRepeatAnchorId,
  setRepeatAnchorId,
} from '../../redux/anchorIds';
import { setNewTaskRepeat } from '../../redux/newTask';
import { editTask, setTaskRepeat } from '../../redux/tasks';

const RepeatMenu = ({ activeTaskId, anchorId }) => {
  const dispatch = useDispatch();

  const setRepeat = (newRepeat) => {
    const action =
      activeTaskId === 'new'
        ? setNewTaskRepeat(newRepeat)
        : setTaskRepeat({ id: activeTaskId, newRepeat });
    dispatch(action);
  };

  const onClose = () => {
    dispatch(setRepeatAnchorId(''));
  };

  const showCustomRepeat = () => {
    dispatch(setCustomRepeatAnchorId(anchorId));
  };

  return (
    <Menu
      anchorEl={!!anchorId && document.getElementById(anchorId)}
      onClose={onClose}
    >
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
  const activeTaskId = activeTaskIdSelector(state);
  const anchorId = anchorIdsSelector(state).repeatId;

  return {
    activeTaskId,
    anchorId,
  };
};

export default connect(mapStateToProps)(RepeatMenu);

RepeatMenu.propTypes = {
  activeTaskId: PropTypes.string.isRequired,
  anchorId: PropTypes.string.isRequired,
};
