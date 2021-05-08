import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  error: {
    whiteSpace: 'pre',
    height: (props) => (props.lg ? '20px' : '18px'),
    fontSize: (props) => (props.lg ? '18px !important' : '16px !important'),
  },
});

const ErrorTypography = ({ error, lg }) => {
  const classes = useStyles({ lg });
  return (
    <Typography
      color="error"
      variant="subtitle1"
      display="block"
      className={classes.error}
    >
      {error !== '' && (
      <>
        {'\u2022 ' /* unicode escape for • */}
        {' '}
        {error}
      </>
      )}
    </Typography>
  );
};

export default ErrorTypography;

ErrorTypography.propTypes = {
  error: PropTypes.string,
  lg: PropTypes.bool,
};

ErrorTypography.defaultProps = {
  error: '',
  lg: false,
};
