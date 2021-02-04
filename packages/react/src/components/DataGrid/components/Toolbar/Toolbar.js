import PropTypes from 'prop-types';
import React from 'react';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

export default function Toolbar(props) {
  function onAddRow() {
    props.onAddRow?.({ newRowIndex: props.numberOfRows });
  }

  return (
    <div className={`${prefix}--rdg-toolbar`}>
      <div className="tools">
        {props.onAddRow && (
          <button type="button" className="btn" onClick={onAddRow}>
            {props.addRowButtonText || 'Add Row'}
          </button>
        )}
        {props.enableFilter && (
          <button type="button" className="btn" onClick={props.onToggleFilter}>
            {props.filterRowsButtonText || 'Filter Rows'}
          </button>
        )}
        {props.children}
      </div>
    </div>
  );
}
Toolbar.propTypes = {
  onAddRow: PropTypes.any,
  numberOfRows: PropTypes.any,
  addRowButtonText: PropTypes.any,
  enableFilter: PropTypes.any,
  onToggleFilter: PropTypes.any,
  filterRowsButtonText: PropTypes.any,
  children: PropTypes.any,
};
