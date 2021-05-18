import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import groupsReducer from './groups';
import activeGroupIdReducer from './activeGroupId';
import tasksReucer from './tasks';
import newTaskReducer from './newTask';
import dueTaskIdReducer from './dueTaskId';
import dueAnchorElReducer from './dueAnchorEl';

const store = configureStore({
  reducer: {
    user: userReducer,
    groups: groupsReducer,
    activeGroupId: activeGroupIdReducer,
    tasks: tasksReucer,
    newTask: newTaskReducer,
    dueTaskId: dueTaskIdReducer,
    dueAnchorEl: dueAnchorElReducer,
  },
  devTools: true,
});

export default store;
