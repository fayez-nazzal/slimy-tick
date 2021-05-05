import React from 'react';
import { MenuItem } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import { useDispatch } from 'react-redux';
import Menu from '../general/Menu';
import { setTaskRepeat } from '../../redux/user';

const RepeatMenu = ({ anchorEl, onClose, showCustomRepeat }) => {
  const dispatch = useDispatch();

  return (
    <Menu anchorEl={anchorEl} onClose={onClose}>
      <MenuItem onClick={() => dispatch(setTaskRepeat('every day'))}>
        <ListItemText primary="Every day" />
      </MenuItem>
      <MenuItem onClick={() => dispatch(setTaskRepeat('every week'))}>
        <ListItemText primary="Every week" />
      </MenuItem>
      <MenuItem
        data-testid="menuitem-priority-medium"
        onClick={() => dispatch(setTaskRepeat('every month'))}
      >
        <ListItemText primary="Every month" />
      </MenuItem>
      <MenuItem onClick={showCustomRepeat}>
        <ListItemText primary="Custom" />
      </MenuItem>
    </Menu>
  );
};

export default RepeatMenu;
