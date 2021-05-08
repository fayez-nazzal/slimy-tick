import React from 'react';
import PropTypes from 'prop-types';
import MuiMenu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <MuiMenu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const Menu = ({
  onClose, anchorEl, children, ariaControls,
}) => (
  <StyledMenu
    open={!!anchorEl}
    anchorEl={anchorEl}
    onClose={onClose}
    onClick={onClose}
    aria-haspopup="true"
    aria-controls={ariaControls}
  >
    {children}
  </StyledMenu>
);

export default Menu;

Menu.defaultProps = {
  anchorEl: null,
  ariaControls: '',
};

Menu.propTypes = {
  onClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.node,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  ariaControls: PropTypes.string,
};
