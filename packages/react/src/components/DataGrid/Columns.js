import PropTypes from 'prop-types';
import React from 'react';
import { SelectCellFormatter } from './formatters';

export const SelectColumn = {
  key: 'select-row',
  name: '',
  width: 35,
  maxWidth: 35,
  frozen: true,
  headerRenderer(props) {
    return (
      <SelectCellFormatter
        aria-label="Select All"
        value={props.allRowsSelected}
        onChange={props.onAllRowsSelectionChange}
      />
    );
  },
  formatter(props) {
    return (
      <SelectCellFormatter
        aria-label="Select"
        value={props.isRowSelected}
        onChange={props.onRowSelectionChange}
      />
    );
  },
};

SelectColumn.headerRenderer.propTypes = {
  prefix: PropTypes.any,
  allRowsSelected: PropTypes.any,
  onAllRowsSelectionChange: PropTypes.any,
};

SelectColumn.formatter.propTypes = {
  isRowSelected: PropTypes.any,
  onRowSelectionChange: PropTypes.any,
};
