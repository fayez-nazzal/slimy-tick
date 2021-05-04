import React from "react"
import IconButton from "@material-ui/core/IconButton"

const ButtonGroupIconButton = props => {
  // intercept props only implemented by `Button`
  const { disableElevation, fullWidth, variant, ...iconButtonProps } = props
  return <IconButton {...iconButtonProps} />
}

export default ButtonGroupIconButton
