import React from "react"
import { setDraftTodoPriority } from "../../redux/user"
import { MenuItem, Typography } from "@material-ui/core"
import ListItemText from "@material-ui/core/ListItemText"
import Menu from "../general/Menu"
import { useDispatch } from "react-redux"

const PriorityMenu = ({ anchorEl, onClose }) => {
  const dispatch = useDispatch()

  return (
    <Menu anchorEl={anchorEl} onClose={onClose}>
      <MenuItem onClick={() => dispatch(setDraftTodoPriority(1))}>
        <Typography variant="h6" component="p" className="priority-veryhigh">
          !!!{" "}
        </Typography>
        <ListItemText primary="Very high" />
      </MenuItem>
      <MenuItem onClick={() => dispatch(setDraftTodoPriority(2))}>
        <Typography variant="h6" component="p" className="priority-high">
          !!{" "}
        </Typography>
        <ListItemText primary=" High" />
      </MenuItem>
      <MenuItem
        data-testid="menuitem-priority-medium"
        onClick={() => dispatch(setDraftTodoPriority(3))}
      >
        <Typography variant="h6" component="p" className="priority-medium">
          !{" "}
        </Typography>
        <ListItemText primary="Medium" />
      </MenuItem>
      <MenuItem onClick={() => dispatch(setDraftTodoPriority(4))}>
        <ListItemText primary="Low" />
      </MenuItem>
    </Menu>
  )
}

export default PriorityMenu
