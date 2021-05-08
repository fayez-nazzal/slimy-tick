import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Typography } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import { useDispatch } from 'react-redux';
import Menu from '../general/Menu';

const PriorityMenu = ({ anchorEl, onClose, setTaskPriority }) => {
  const dispatch = useDispatch();

  return (
    <Menu anchorEl={anchorEl} onClose={onClose}>
      <MenuItem onClick={() => dispatch(setTaskPriority(1))}>
        <Typography variant="h6" component="p" className="priority-veryhigh">
          !!!
          {' '}
        </Typography>
        <ListItemText primary="Very high" />
      </MenuItem>
      <MenuItem onClick={() => dispatch(setTaskPriority(2))}>
        <Typography variant="h6" component="p" className="priority-high">
          !!
          {' '}
        </Typography>
        <ListItemText primary=" High" />
      </MenuItem>
      <MenuItem
        data-testid="menuitem-priority-medium"
        onClick={() => dispatch(setTaskPriority(3))}
      >
        <Typography variant="h6" component="p" className="priority-medium">
          !
          {' '}
        </Typography>
        <ListItemText primary="Medium" />
      </MenuItem>
      <MenuItem onClick={() => dispatch(setTaskPriority(4))}>
        <ListItemText primary="Low" />
      </MenuItem>
    </Menu>
  );
};

export default PriorityMenu;

PriorityMenu.defaultProps = {
  anchorEl: null,
};

PriorityMenu.propTypes = {
  anchorEl: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  setTaskPriority: PropTypes.func.isRequired,
};
