import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import Task from '../Task';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

const TaskList = ({ tasks }) => {
  const classes = useStyles();

  useEffect(() => {
    console.debug('task list rendered');
  });

  return (
    <List className={classes.root}>
      {tasks.map((task) => (
        <Task key={task._id} {...task} />
      ))}
    </List>
  );
};

const mapStateToProps = (state) => ({
  tasks: state.tasks,
});

export default connect(mapStateToProps)(TaskList);

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.shape({
    checked: PropTypes.bool,
    body: PropTypes.string,
    _id: PropTypes.string,
    created: PropTypes.string,
    priority: PropTypes.number,
    dueDate: PropTypes.string,
    dueTime: PropTypes.string,
    repeat: PropTypes.string,
  })).isRequired,
};
