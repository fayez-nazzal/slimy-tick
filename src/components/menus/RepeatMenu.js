import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import { useDispatch } from 'react-redux';
import Menu from '../general/Menu';

const RepeatMenu = ({
  anchorEl, onClose, showCustomRepeat, setTaskRepeat,
}) => {
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

RepeatMenu.propTypes = {
  anchorEl: PropTypes.element.isRequired,
  onClose: PropTypes.func.isRequired,
  showCustomRepeat: PropTypes.func.isRequired,
  setTaskRepeat: PropTypes.func.isRequired,
};
