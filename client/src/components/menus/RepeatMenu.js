import React from "react"
import { setDraftTodoRepeat } from "../../redux/user"
import { MenuItem } from "@material-ui/core"
import ListItemText from "@material-ui/core/ListItemText"
import Menu from "../general/Menu"
import { useDispatch } from "react-redux"

const RepeatMenu = ({ anchorEl, onClose, showCustomRepeat }) => {
  const dispatch = useDispatch()

  return (
    <Menu anchorEl={anchorEl} onClose={onClose}>
      <MenuItem onClick={() => dispatch(setDraftTodoRepeat("every day"))}>
        <ListItemText primary="Every day" />
      </MenuItem>
      <MenuItem onClick={() => dispatch(setDraftTodoRepeat("every week"))}>
        <ListItemText primary="Every week" />
      </MenuItem>
      <MenuItem
        data-testid="menuitem-priority-medium"
        onClick={() => dispatch(setDraftTodoRepeat("every month"))}
      >
        <ListItemText primary="Every month" />
      </MenuItem>
      <MenuItem onClick={showCustomRepeat}>
        <ListItemText primary="Custom" />
      </MenuItem>
    </Menu>
  )
}

export default RepeatMenu
