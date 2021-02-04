import PropTypes from 'prop-types';
import React, { useCallback, memo } from 'react';

import HeaderCell from './HeaderCell';
import { assertIsValidKey } from './utils';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

function HeaderRow({
  columns,
  lastFrozenColumnIndex,
  rows,
  rowKey,
  onSelectedRowsChange,
  allRowsSelected,
  onColumnResize,
  sortColumn,
  sortDirection,
  onSort,
}) {
  const handleAllRowsSelectionChange = useCallback(
    (checked) => {
      if (!onSelectedRowsChange) return;

      assertIsValidKey(rowKey);

      const newSelectedRows = new Set();
      if (checked) {
        for (const row of rows) {
          newSelectedRows.add(row[rowKey]);
        }
      }

      onSelectedRowsChange(newSelectedRows);
    },
    [onSelectedRowsChange, rows, rowKey]
  );

  return (
    <div
      role="row"
      aria-rowindex={1} // aria-rowindex is 1 based
      className={`${prefix}--rdg-header-row`}>
      {columns.map((column) => {
        return (
          <HeaderCell
            key={column.key}
            column={column}
            lastFrozenColumnIndex={lastFrozenColumnIndex}
            onResize={onColumnResize}
            allRowsSelected={allRowsSelected}
            onAllRowsSelectionChange={handleAllRowsSelectionChange}
            onSort={onSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />
        );
      })}
    </div>
  );
}

HeaderRow.propTypes = {
  columns: PropTypes.any,
  lastFrozenColumnIndex: PropTypes.any,
  rows: PropTypes.any,
  rowKey: PropTypes.any,
  onSelectedRowsChange: PropTypes.any,
  allRowsSelected: PropTypes.any,
  onColumnResize: PropTypes.any,
  sortColumn: PropTypes.any,
  sortDirection: PropTypes.any,
  onSort: PropTypes.any,
};

export default memo(HeaderRow);
