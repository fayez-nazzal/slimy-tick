/* eslint-disable import/prefer-default-export */
import { createSelector } from '@reduxjs/toolkit';

export const userSelector = createSelector(
  (state) => state.user,
  (user) => user,
);

export const groupsSelector = createSelector(
  (state) => state.groups,
  (groups) => groups,
);

export const activeGroupSelector = createSelector(
  (state) => state.groups,
  (state) => state.activeGroupId,
  (groups, activeGroupId) => groups.find((group) => group._id === activeGroupId),
);

export const tasksSelector = createSelector(
  (state) => state.tasks,
  (tasks) => tasks,
);

export const newTaskSelector = createSelector(
  (state) => state.newTask,
  (newTask) => newTask,
);

export const dueTaskIdSelector = createSelector(
  (state) => state.dueTaskId,
  (dueTaskId) => dueTaskId,
);

export const dueAnchorElIdSelector = createSelector(
  (state) => state.dueAnchorELId,
  (dueAnchorELId) => dueAnchorELId,
);
