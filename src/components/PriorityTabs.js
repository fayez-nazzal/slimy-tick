import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 'auto',
    borderRadius: 0,
    background: 'transparent',
  },
  button: {
    color: 'transparent',
    marginTop: 'auto',
    textTransform: 'none',
    border: 0,
    padding: 0,
    fontSize: 14,
    height: 12,
    borderRadius: 0,
    transition: 'all ease-in-out 0.2s',
    '&:hover': {
      color: 'black',
      height: 22,
    },
  },
  all: {
    backgroundColor: '#cccccc !important',
  },
  veryHigh: {
    backgroundColor: '#ed5f00 !important',
  },
  high: {
    backgroundColor: '#f48c00 !important',
  },
  medium: {
    backgroundColor: '#f5b900 !important',
  },
  low: {
    backgroundColor: '#7dbc00 !important',
  },
});

const PriorityTabs = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ButtonGroup fullWidth>
        <Button className={[classes.button, classes.all]}>All</Button>
        <Button className={[classes.button, classes.veryHigh]}>
          Very high !!!
        </Button>
        <Button className={[classes.button, classes.high]}>High !!</Button>
        <Button className={[classes.button, classes.medium]}>Medium !</Button>
      </ButtonGroup>
    </div>
  );
};

export default PriorityTabs;
