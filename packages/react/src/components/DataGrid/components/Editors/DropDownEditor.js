import PropTypes from 'prop-types';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

function DropDownEditor({ column, value, onCommit, options }, ref) {
  const selectRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getInputNode() {
      return selectRef.current;
    },
    getValue() {
      return {
        [column.key]: selectRef.current.value,
      };
    },
  }));

  return (
    <select
      ref={selectRef}
      className={`${prefix}--rdg-select-editor`}
      defaultValue={value}
      onBlur={onCommit}
      size={options.length}
      style={{ maxHeight: 200, height: 'auto', overflowY: 'auto' }}>
      {options.map((name) =>
        typeof name === 'string' ? (
          <option key={name} value={name} onClick={onCommit}>
            {name}
          </option>
        ) : (
          <option
            key={name.id}
            value={name.value}
            title={name.title}
            onClick={onCommit}>
            {name.text || name.value}
          </option>
        )
      )}
    </select>
  );
}

DropDownEditor.propTypes = {
  column: PropTypes.any,
  value: PropTypes.any,
  onCommit: PropTypes.any,
  options: PropTypes.any,
};

export default forwardRef(DropDownEditor);
