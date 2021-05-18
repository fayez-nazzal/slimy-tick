import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import groupsReducer from './groups';
import activeGroupIdReducer from './activeGroupId';
import tasksReucer from './tasks';
import newTaskReducer from './newTask';
import activeTaskIdReducer from './activeTaskId';
import anchorIdsReducer from './anchorIds';

const store = configureStore({
  reducer: {
    user: userReducer,
    groups: groupsReducer,
    activeGroupId: activeGroupIdReducer,
    tasks: tasksReucer,
    newTask: newTaskReducer,
    activeTaskId: activeTaskIdReducer,
    anchorIds: anchorIdsReducer,
  },
  devTools: true,
});

export default store;
