import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import Checkbox from "@material-ui/core/Checkbox"
import CheckBoxOutlineBlankSharpIcon from "@material-ui/icons/CheckBoxOutlineBlankSharp"
import CheckBoxSharpIcon from "@material-ui/icons/CheckBoxSharp"
import MoreHorizSharpIcon from "@material-ui/icons/MoreHorizSharp"
import IconButton from "@material-ui/core/IconButton"
import Menu from "./ActionsMenu"

export const Task = props => {
  const [anchorEl, setAnchorEl] = useState(false)

  const classes = useStyles()
  return (
    <ListItem dense divider>
      <ListItemIcon>
        <Checkbox
          edge="start"
          color="primary"
          checked={props.checked}
          checkedIcon={<CheckBoxSharpIcon />}
          icon={<CheckBoxOutlineBlankSharpIcon />}
        />
      </ListItemIcon>
      <ListItemText disableTypography>
        <input
          value={props.body}
          variant="filled"
          disableAnimation
          className={classes.input}
        />
      </ListItemText>
      <ListItemSecondaryAction>
        <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
          <MoreHorizSharpIcon color="primary" />
        </IconButton>
        <Menu onClose={() => setAnchorEl(null)} anchorEl={anchorEl} />
      </ListItemSecondaryAction>
    </ListItem>
  )
}

const useStyles = makeStyles({
  input: {
    border: "none !important",
    backgroundColor: "transparent !important",
    outline: "none !important",
    height: "100%",
    fontSize: "16px",
    width: "100%",
  },
})
