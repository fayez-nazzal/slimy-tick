import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Typography } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import { connect, useDispatch } from 'react-redux';
import Menu from '../general/Menu';
import {
  anchorIdsSelector, activeTaskIdSelector,
} from '../../redux/selectors';
import { setPriorityAnchorId } from '../../redux/anchorIds';
import { setNewTaskPriority } from '../../redux/newTask';
import { editTask, setTaskPriority } from '../../redux/tasks';

const PriorityMenu = ({ anchorId, activeTaskId }) => {
  const dispatch = useDispatch();

  const setPriority = (newPriority) => {
    const action = activeTaskId === 'new' ? setNewTaskPriority(newPriority) : setTaskPriority({ id: activeTaskId, newPriority });
    dispatch(action);
  };

  const onClose = () => {
    dispatch(setPriorityAnchorId(''));
  };

  return (
    <Menu anchorEl={!!anchorId && document.getElementById(anchorId)} onClose={onClose}>
      <MenuItem onClick={() => setPriority(1)}>
        <Typography variant="h6" component="p" className="priority-veryhigh">
          !!!
          {' '}
        </Typography>
        <ListItemText primary="Very high" />
      </MenuItem>
      <MenuItem onClick={() => setPriority(2)}>
        <Typography variant="h6" component="p" className="priority-high">
          !!
          {' '}
        </Typography>
        <ListItemText primary=" High" />
      </MenuItem>
      <MenuItem
        data-testid="menuitem-priority-medium"
        onClick={() => setPriority(3)}
      >
        <Typography variant="h6" component="p" className="priority-medium">
          !
          {' '}
        </Typography>
        <ListItemText primary="Medium" />
      </MenuItem>
      <MenuItem onClick={() => setPriority(4)}>
        <ListItemText primary="Low" />
      </MenuItem>
    </Menu>
  );
};

const mapStateToProps = (state) => {
  const activeTaskId = activeTaskIdSelector(state);
  const anchorId = anchorIdsSelector(state).priorityId;

  return {
    activeTaskId,
    anchorId,
  };
};

export default connect(mapStateToProps)(PriorityMenu);

PriorityMenu.propTypes = {
  activeTaskId: PropTypes.string.isRequired,
  anchorId: PropTypes.string.isRequired,
};
