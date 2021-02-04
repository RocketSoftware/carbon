import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

export function SelectCellFormatter({
  value,
  disabled,
  onChange,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}) {
  function handleChange(e) {
    onChange(e.target.checked, e.nativeEvent.shiftKey);
  }

  return (
    <label
      className={cx(`${prefix}--rdg-checkbox-label`, {
        [`${prefix}--rdg-checkbox-label-disabled`]: disabled,
      })}>
      <input
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        type="checkbox"
        className={`${prefix}--rdg-checkbox-input`}
        disabled={disabled}
        onChange={handleChange}
        checked={value}
      />
      <div className={`${prefix}--rdg-checkbox`} />
    </label>
  );
}

SelectCellFormatter.propTypes = {
  value: PropTypes.any,
  disabled: PropTypes.any,
  onChange: PropTypes.any,
  'aria-label': PropTypes.any,
  'aria-labelledby': PropTypes.any,
};
