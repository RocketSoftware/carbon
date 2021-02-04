import PropTypes from 'prop-types';
import React from 'react';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

export function CellExpanderFormatter({ expanded, onCellExpand }) {
  function handleCellExpand(e) {
    e.stopPropagation();
    onCellExpand();
  }

  return (
    /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
    <div className={`${prefix}--rdg-cell-expand`}>
      <span onClick={handleCellExpand}>{expanded ? '\u25BC' : '\u25B6'}</span>
    </div>
    /* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
  );
}

CellExpanderFormatter.propTypes = {
  expanded: PropTypes.bool,
  onCellExpand: PropTypes.func,
};
