import React from "react"
import MuiMenu from "@material-ui/core/Menu"
import { withStyles } from "@material-ui/core"

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})(props => (
  <MuiMenu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
))

const Menu = ({ onClose, anchorEl, children, ariaControls }) => {
  return (
    <StyledMenu
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={onClose}
      onClick={onClose}
      variant="contained"
      aria-haspopup="true"
      aria-controls={ariaControls}
    >
      {children}
    </StyledMenu>
  )
}

export default Menu
