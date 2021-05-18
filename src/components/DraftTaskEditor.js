import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Editor, EditorState, CompositeDecorator, Modifier, SelectionState,
} from 'draft-js';
import clsx from 'clsx';
import { connect, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  DraftPriorityTag,
  DraftRepeatTag,
  DraftDueDateTag,
  DraftDueTimeTag,
} from './DraftStrategyTags';
import {
  matchDueDate, matchDueTime, matchRepeat, matchPriorityAndReturnRange,
} from '../utils/matchers';
import { setNewTaskBody } from '../redux/newTask';
import { newTaskSelector } from '../redux/selectors';

const useStyles = makeStyles((theme) => ({
  editorContainer: {
    backgroundColor: '#f1f2f195',
    margin: theme.spacing(0, 'auto'),
    overflowX: 'hidden',
    padding: theme.spacing(0.8, 1),
    caretColor: 'black !important',
    wordBreak: 'keep-all',
    paddingBottom: (props) => (props.focus ? theme.spacing(4.8) : theme.spacing(1)),
    width: '100%',
    minHeight: '1.2rem',
    fontSize: '18px',
    transition: 'all 0.3s',
    borderRight: '3rem solid transparent',
  },
}));

const DraftTaskEditor = ({
  focus, setFocus, disableBlur, newTask,
}) => {
  const matchForStrategy = (
    contentBlock,
    callback,
    _,
    matcher,
    matcherReturnsRange,
  ) => {
    const text = contentBlock.getText();
    const matchResult = matcher(text);

    if (matchResult && matcherReturnsRange) {
      return callback(matchResult[0], matchResult[1]);
    }

    const matchIndex = text.lastIndexOf(matchResult);
    if (matchResult && matchResult.length) callback(matchIndex, matchIndex + matchResult.length);

    return null;
  };

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty(
    new CompositeDecorator([
      {
        strategy: (contentBlock, callback, contentState) => {
          matchForStrategy(contentBlock, callback, contentState, () => matchForStrategy(
            contentBlock,
            callback,
            contentState,
            matchPriorityAndReturnRange,
            true,
          ));
        },
        component: DraftPriorityTag,
      },
      {
        strategy: (contentBlock, callback, contentState) => {
          matchForStrategy(contentBlock, callback, contentState, matchRepeat);
        },
        component: DraftRepeatTag,
      },
      {
        strategy: (contentBlock, callback, contentState) => {
          matchForStrategy(
            contentBlock,
            callback,
            contentState,
            matchDueDate,
          );
        },
        component: DraftDueDateTag,
      },
      {
        strategy: (contentBlock, callback, contentState) => {
          matchForStrategy(
            contentBlock,
            callback,
            contentState,
            matchDueTime,
          );
        },
        component: DraftDueTimeTag,
      },
    ]),
  ));
  const editorRef = useRef(null);
  const classes = useStyles({ focus });
  const dispatch = useDispatch();

  useEffect(() => {
    const currentDraftText = editorState
      .getCurrentContent()
      .getPlainText('\u0001');

    if (newTask.body !== currentDraftText) {
      // eslint-disable-next-line no-use-before-define
      setDraftBodyText(newTask.body);
    }
  }, [newTask.body]);

  useEffect(() => {
    console.debug('draft task editor rendered');
  });

  const setDraftBodyText = (newText) => {
    const currentDraftText = editorState
      .getCurrentContent()
      .getPlainText('\u0001');

    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const block = contentState.getBlockForKey(selection.getAnchorKey());

    // this is not the best way to replace
    // but i think it wont impact performance, most tasks text is short
    const replaced = Modifier.replaceText(
      contentState,
      new SelectionState({
        anchorKey: block.getKey(),
        anchorOffset: 0,
        focusKey: block.getKey(),
        focusOffset: currentDraftText.length,
      }),
      newText,
    );

    // eslint-disable-next-line no-use-before-define
    onDraftChange(EditorState.push(editorState, replaced, 'change-block-data'));
  };

  const onDraftChange = (state) => {
    setEditorState(state);
    const newContent = state.getCurrentContent().getPlainText('\u0001');

    if (newContent !== newTask.body) dispatch(setNewTaskBody(newContent));
  };

  //   const clearEditor = () => {
  //     const emptyState = EditorState.push(
  //       editorState,
  //       ContentState.createFromText(''),
  //       'remove-range',
  //     );
  //     setEditorState(emptyState);
  //   };

  return (
    <div className={clsx([classes.editorContainer])}>
      <Editor
        placeholder={'Type your task here \u2713'}
        ariaLabel="task input"
        ref={editorRef}
        editorState={editorState}
        onChange={onDraftChange}
        onFocus={() => setFocus(true)}
        onBlur={() => {
          setTimeout(() => {
            if (disableBlur.current) return;
            setFocus(false);
          });
        }}
        className="draftjs-editir"
        handleReturn={() => 'handled'}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  newTask: newTaskSelector(state),
});

export default connect(mapStateToProps)(DraftTaskEditor);

DraftTaskEditor.propTypes = {
  disableBlur: PropTypes.shape({
    current: PropTypes.bool,
  }).isRequired,
  focus: PropTypes.bool.isRequired,
  setFocus: PropTypes.func.isRequired,
  newTask: PropTypes.shape({
    body: PropTypes.string,
    priority: PropTypes.number,
    checked: PropTypes.bool,
    dueDate: PropTypes.string,
    dueTime: PropTypes.string,
    repeat: PropTypes.string,
  }).isRequired,
};
