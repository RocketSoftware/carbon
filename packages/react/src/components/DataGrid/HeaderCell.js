import PropTypes from 'prop-types';
import React, { createElement } from 'react';
import cx from 'classnames';

import SortableHeaderCell from './headerCells/SortableHeaderCell';
import ResizableHeaderCell from './headerCells/ResizableHeaderCell';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

function getAriaSort(sortDirection) {
  switch (sortDirection) {
    case 'ASC':
      return 'ascending';
    case 'DESC':
      return 'descending';
    default:
      return 'none';
  }
}

export default function HeaderCell({
  column,
  lastFrozenColumnIndex,
  onResize,
  allRowsSelected,
  onAllRowsSelectionChange,
  sortColumn,
  sortDirection,
  onSort,
}) {
  function getCell() {
    if (!column.headerRenderer) return column.name;

    return createElement(column.headerRenderer, {
      column,
      allRowsSelected,
      onAllRowsSelectionChange,
    });
  }

  let cell = getCell();

  if (column.sortable) {
    cell = (
      <SortableHeaderCell
        column={column}
        onSort={onSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}>
        {cell}
      </SortableHeaderCell>
    );
  }

  const className = cx(`${prefix}--rdg-cell`, column.headerCellClass, {
    [`${prefix}--rdg-cell-frozen`]: column.frozen,
    [`${prefix}--rdg-cell-frozen-last`]: column.idx === lastFrozenColumnIndex,
  });
  const style = {
    width: column.width,
    left: column.left,
  };

  cell = (
    <div
      role="columnheader"
      aria-colindex={column.idx + 1}
      aria-sort={
        sortColumn === column.key ? getAriaSort(sortDirection) : undefined
      }
      className={className}
      style={style}>
      {cell}
    </div>
  );

  if (column.resizable) {
    cell = (
      <ResizableHeaderCell column={column} onResize={onResize}>
        {cell}
      </ResizableHeaderCell>
    );
  }

  return cell;
}

HeaderCell.propTypes = {
  column: PropTypes.any,
  lastFrozenColumnIndex: PropTypes.any,
  onResize: PropTypes.any,
  allRowsSelected: PropTypes.any,
  onAllRowsSelectionChange: PropTypes.any,
  sortColumn: PropTypes.any,
  sortDirection: PropTypes.any,
  onSort: PropTypes.any,
};
