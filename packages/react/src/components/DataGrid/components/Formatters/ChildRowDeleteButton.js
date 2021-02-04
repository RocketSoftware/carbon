import PropTypes from 'prop-types';
import React from 'react';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

export function ChildRowDeleteButton({
  onDeleteSubRow,
  isDeleteSubRowEnabled,
}) {
  return (
    <>
      <div className={`${prefix}--rdg-child-row-action-cross`} />
      {isDeleteSubRowEnabled && (
        <span // eslint-disable-line
          aria-label="delete"
          role="img"
          className={`${prefix}--rdg-child-row-btn`}
          onClick={onDeleteSubRow}>
          ❌
        </span>
      )}
    </>
  );
}

ChildRowDeleteButton.propTypes = {
  onDeleteSubRow: PropTypes.any,
  isDeleteSubRowEnabled: PropTypes.any,
};
