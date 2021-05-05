/* eslint-disable react/require-default-props */

/* This component is just a workaround to fix error produced
   by IconButton inside ButtonGroupfor more info,
  see https://github.com/mui-org/material-ui/issues/17226 */

import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';

const ButtonGroupIconButton = (props) => {
  // intercept props only implemented by `Button`
  const {
    disableElevation, fullWidth, variant, ...iconButtonProps
  } = props;
  return <IconButton {...iconButtonProps} />;
};

export default ButtonGroupIconButton;

ButtonGroupIconButton.propTypes = {
  disableElevation: PropTypes.bool,
  fullWidth: PropTypes.bool,
  variant: PropTypes.string,
};
