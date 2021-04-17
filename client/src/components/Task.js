import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import Checkbox from "@material-ui/core/Checkbox"
import CheckBoxOutlineBlankSharpIcon from "@material-ui/icons/CheckBoxOutlineBlankSharp"
import CheckBoxSharpIcon from "@material-ui/icons/CheckBoxSharp"

export const Task = props => {
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
      <ListItemText primary={`${props.body}`} />
      <ListItemSecondaryAction></ListItemSecondaryAction>
    </ListItem>
  )
}
