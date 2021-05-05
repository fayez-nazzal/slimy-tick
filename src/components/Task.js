import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankSharpIcon from '@material-ui/icons/CheckBoxOutlineBlankSharp';
import CheckBoxSharpIcon from '@material-ui/icons/CheckBoxSharp';
import MoreHorizSharpIcon from '@material-ui/icons/MoreHorizSharp';
import IconButton from '@material-ui/core/IconButton';
import Menu from './menus/EditTaskMenu';

const useStyles = makeStyles({
  input: {
    border: 'none !important',
    backgroundColor: 'transparent !important',
    outline: 'none !important',
    height: '100%',
    fontSize: '16px',
    width: '100%',
  },
});

const Task = ({
  checked, body, onChange, id,
}) => {
  const [anchorEl, setAnchorEl] = useState(false);

  const classes = useStyles();
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
        onChange={(e) => onChange(id, e.target.value)}
        variant="filled"
        className={classes.input}
      />
      <ListItemSecondaryAction>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <MoreHorizSharpIcon color="primary" />
        </IconButton>
        <Menu onClose={() => setAnchorEl(null)} anchorEl={anchorEl} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default Task;

Task.propTypes = {
  checked: PropTypes.bool.isRequired,
  body: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  // created: PropTypes.string.isRequired,
  // priority: PropTypes.string.isRequired,
  // dueDate: PropTypes.string.isRequired,
  // dueTime: PropTypes.string.isRequired,
  // repeat: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
