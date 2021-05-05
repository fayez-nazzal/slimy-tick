import React from 'react';
import StrategyTag from './StrategyTag';

export const DraftPriorityTag = (props) => <StrategyTag {...props} priority />;
export const DraftRepeatTag = (props) => <StrategyTag {...props} repeat />;
export const DraftDueDateTag = (props) => <StrategyTag {...props} dueDate />;
export const DraftDueTimeTag = (props) => <StrategyTag {...props} dueTime />;
