import PropTypes from 'prop-types';
import React, {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
} from 'react';
import cx from 'classnames';
import { useClickOutside } from '../hooks';
import SimpleTextEditor from './SimpleTextEditor';
import { preventDefault } from '../utils';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

export default function EditorContainer({
  rowIdx,
  column,
  row,
  rowHeight,
  left,
  top,
  onCommit,
  onCommitCancel,
  scrollLeft,
  scrollTop,
  firstEditorKeyPress: key,
}) {
  const editorRef = useRef(null);
  const changeCommitted = useRef(false);
  const changeCanceled = useRef(false);
  const [isValid, setValid] = useState(true);
  const prevScrollLeft = useRef(scrollLeft);
  const prevScrollTop = useRef(scrollTop);
  const isUnmounting = useRef(false);
  const onClickCapture = useClickOutside(commit);

  const getInputNode = useCallback(() => editorRef.current?.getInputNode(), []);

  const commitCancel = useCallback(() => {
    changeCanceled.current = true;
    onCommitCancel();
  }, [onCommitCancel]);

  useLayoutEffect(() => {
    const inputNode = getInputNode();

    if (inputNode instanceof HTMLElement) {
      inputNode.focus();
    }
    if (inputNode instanceof HTMLInputElement) {
      inputNode.select();
    }
  }, [getInputNode]);

  // close editor when scrolling
  useEffect(() => {
    if (
      scrollLeft !== prevScrollLeft.current ||
      scrollTop !== prevScrollTop.current
    ) {
      commitCancel();
    }
  }, [commitCancel, scrollLeft, scrollTop]);

  useEffect(
    () => () => {
      isUnmounting.current = true;
    },
    []
  );

  // commit changes when editor is closed
  useEffect(() => () => {
    if (
      isUnmounting.current &&
      !changeCommitted.current &&
      !changeCanceled.current
    ) {
      commit();
    }
  });

  function getInitialValue() {
    const value = row[column.key];
    if (key === 'Delete' || key === 'Backspace') {
      return '';
    }
    if (key === 'Enter') {
      return value;
    }

    return key || value;
  }

  function isCaretAtBeginningOfInput() {
    const inputNode = getInputNode();
    return (
      inputNode instanceof HTMLInputElement && inputNode.selectionEnd === 0
    );
  }

  function isCaretAtEndOfInput() {
    const inputNode = getInputNode();
    return (
      inputNode instanceof HTMLInputElement &&
      inputNode.selectionStart === inputNode.value.length
    );
  }

  function editorHasResults() {
    return editorRef.current?.hasResults?.() ?? false;
  }

  function editorIsSelectOpen() {
    return editorRef.current?.isSelectOpen?.() ?? false;
  }

  function isNewValueValid(value) {
    const isValid = editorRef.current?.validate?.(value);
    if (typeof isValid === 'boolean') {
      setValid(isValid);
      return isValid;
    }
    return true;
  }

  function preventDefaultNavigation(key) {
    return (
      (key === 'ArrowLeft' && !isCaretAtBeginningOfInput()) ||
      (key === 'ArrowRight' && !isCaretAtEndOfInput()) ||
      (key === 'Escape' && editorIsSelectOpen()) ||
      (['ArrowUp', 'ArrowDown'].includes(key) && editorHasResults())
    );
  }

  function commit() {
    if (!editorRef.current) return;
    const updated = editorRef.current.getValue();
    if (isNewValueValid(updated)) {
      changeCommitted.current = true;
      const cellKey = column.key;
      onCommit({ cellKey, rowIdx, updated });
    }
  }

  function onKeyDown(e) {
    if (preventDefaultNavigation(e.key)) {
      e.stopPropagation();
    } else if (
      [
        'Enter',
        'Tab',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
      ].includes(e.key)
    ) {
      commit();
    } else if (e.key === 'Escape') {
      commitCancel();
    }
  }

  function createEditor() {
    // return custom column editor or SimpleEditor if none specified
    if (column.editor) {
      return (
        <column.editor
          ref={editorRef}
          column={column}
          value={getInitialValue()}
          row={row}
          height={rowHeight}
          onCommit={commit}
          onCommitCancel={commitCancel}
          onOverrideKeyDown={onKeyDown}
        />
      );
    }

    return (
      <SimpleTextEditor
        ref={editorRef}
        column={column}
        value={getInitialValue()}
        onCommit={commit}
      />
    );
  }

  const className = cx(`${prefix}--rdg-editor-container`, {
    [`${prefix}--rdg-editor-invalid`]: !isValid,
  });

  return (
    <div //eslint-disable-line jsx-a11y/no-static-element-interactions
      className={className}
      style={{ height: rowHeight, width: column.width, left, top }}
      onClickCapture={onClickCapture}
      onKeyDown={onKeyDown}
      onContextMenu={preventDefault}>
      {createEditor()}
    </div>
  );
}

EditorContainer.propTypes = {
  rowIdx: PropTypes.any,
  column: PropTypes.any,
  row: PropTypes.any,
  rowHeight: PropTypes.any,
  left: PropTypes.any,
  top: PropTypes.any,
  onCommit: PropTypes.any,
  onCommitCancel: PropTypes.any,
  scrollLeft: PropTypes.any,
  scrollTop: PropTypes.any,
  firstEditorKeyPress: PropTypes.any,
};
