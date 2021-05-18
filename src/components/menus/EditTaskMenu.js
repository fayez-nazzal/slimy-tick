import React from 'react';
import PropTypes from 'prop-types';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PriorityHighIcon from '@material-ui/icons/PriorityHighSharp';
import DateRangeIcon from '@material-ui/icons/DateRangeSharp';
import UpdateIcon from '@material-ui/icons/UpdateSharp';
import MenuItem from '@material-ui/core/MenuItem';
import { useDispatch } from 'react-redux';
import Menu from '../general/Menu';
import { setPriorityAnchorId, setDueAnchorId, setRepeatAnchorId } from '../../redux/anchorIds';

const ActionsMenu = ({ anchorId, onClose }) => {
  const dispatch = useDispatch();

  const onPriority = () => {
    dispatch(setPriorityAnchorId(anchorId));
  };

  const onDue = () => {
    dispatch(setDueAnchorId(anchorId));
  };

  const onRepeat = () => {
    dispatch(setRepeatAnchorId(anchorId));
  };

  return (
    <Menu anchorEl={!!anchorId && document.getElementById(anchorId)} onClose={onClose} ariaControls="actions-menu">
      <MenuItem onClick={onPriority}>
        <ListItemIcon>
          <PriorityHighIcon color="primary" />
        </ListItemIcon>
        <ListItemText primary="Priority" />
      </MenuItem>
      <MenuItem onClick={onDue}>
        <ListItemIcon>
          <DateRangeIcon color="primary" />
        </ListItemIcon>
        <ListItemText primary="Due" />
      </MenuItem>
      <MenuItem onClick={onRepeat}>
        <ListItemIcon>
          <UpdateIcon color="primary" />
        </ListItemIcon>
        <ListItemText primary="Repeat" />
      </MenuItem>
    </Menu>
  );
};

export default ActionsMenu;

ActionsMenu.propTypes = {
  anchorId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};
