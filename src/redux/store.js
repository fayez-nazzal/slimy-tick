import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import groupsReducer from './groups';
import activeGroupIdReducer from './activeGroupId';
import tasksReucer from './tasks';
import newTaskReducer from './newTask';
import dueTaskIdReducer from './dueTaskId';
import dueAnchorElIdReducer from './dueAnchorElId';

const store = configureStore({
  reducer: {
    user: userReducer,
    groups: groupsReducer,
    activeGroupId: activeGroupIdReducer,
    tasks: tasksReucer,
    newTask: newTaskReducer,
    dueTaskId: dueTaskIdReducer,
    dueAnchorELId: dueAnchorElIdReducer,
  },
  devTools: true,
});

export default store;
