import React from 'react';
import PropTypes from 'prop-types';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AlarmIcon from '@material-ui/icons/AlarmSharp';
import PriorityHighIcon from '@material-ui/icons/PriorityHighSharp';
import DateRangeIcon from '@material-ui/icons/DateRangeSharp';
import UpdateIcon from '@material-ui/icons/UpdateSharp';
import MenuItem from '@material-ui/core/MenuItem';
import { useDispatch } from 'react-redux';
import Menu from '../general/Menu';
import { setDueAnchorElId } from '../../redux/dueAnchorElId';

const ActionsMenu = ({ anchorElId, onClose }) => {
  const dispatch = useDispatch();

  const onDue = () => {
    dispatch(setDueAnchorElId(anchorElId));
  };

  return (
    <Menu anchorEl={!!anchorElId && document.getElementById(anchorElId)} onClose={onClose} ariaControls="actions-menu">
      <MenuItem>
        <ListItemIcon>
          <AlarmIcon color="primary" />
        </ListItemIcon>
        <ListItemText primary="set reminder" />
      </MenuItem>
      <MenuItem>
        <ListItemIcon>
          <UpdateIcon color="primary" />
        </ListItemIcon>
        <ListItemText primary="repeat" />
      </MenuItem>
      <MenuItem>
        <ListItemIcon>
          <PriorityHighIcon color="primary" />
        </ListItemIcon>
        <ListItemText primary="set priority" />
      </MenuItem>
      <MenuItem onClick={onDue}>
        <ListItemIcon>
          <DateRangeIcon color="primary" />
        </ListItemIcon>
        <ListItemText primary="due" />
      </MenuItem>
    </Menu>
  );
};

export default ActionsMenu;

ActionsMenu.defaultProps = {
  anchorElId: '',
};

ActionsMenu.propTypes = {
  anchorElId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};
