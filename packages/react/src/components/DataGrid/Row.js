import PropTypes from 'prop-types';
import React, { memo } from 'react';
import cx from 'classnames';

import Cell from './Cell';
import { wrapEvent } from './utils';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

function Row({
  cellRenderer: CellRenderer = Cell,
  className,
  eventBus,
  rowIdx,
  isRowSelected,
  lastFrozenColumnIndex,
  copiedCellIdx,
  draggedOverCellIdx,
  row,
  viewportColumns,
  selectedCellProps,
  onRowClick,
  rowClass,
  setDraggedOverRowIdx,
  onMouseEnter,
  top,
  'aria-rowindex': ariaRowIndex,
  'aria-selected': ariaSelected,
  ...props
}) {
  function handleDragEnter() {
    setDraggedOverRowIdx?.(rowIdx);
  }

  className = cx(
    `${prefix}--rdg-row`,
    `${prefix}--rdg-row-${rowIdx % 2 === 0 ? 'even' : 'odd'}`,
    { [`${prefix}--rdg-row-selected`]: isRowSelected },
    rowClass?.(row),
    className
  );

  return (
    <div
      aria-rowindex={ariaRowIndex}
      aria-selected={ariaSelected}
      className={className}
      onMouseEnter={wrapEvent(handleDragEnter, onMouseEnter)}
      style={{ top }}
      {...props}>
      {viewportColumns.map((column) => (
        <CellRenderer
          key={column.key}
          rowIdx={rowIdx}
          column={column}
          lastFrozenColumnIndex={lastFrozenColumnIndex}
          row={row}
          isCopied={copiedCellIdx === column.idx}
          isDraggedOver={draggedOverCellIdx === column.idx}
          isRowSelected={isRowSelected}
          eventBus={eventBus}
          selectedCellProps={
            selectedCellProps?.idx === column.idx
              ? selectedCellProps
              : undefined
          }
          onRowClick={onRowClick}
        />
      ))}
    </div>
  );
}

Row.propTypes = {
  cellRenderer: PropTypes.any,
  className: PropTypes.any,
  eventBus: PropTypes.any,
  rowIdx: PropTypes.any,
  isRowSelected: PropTypes.any,
  lastFrozenColumnIndex: PropTypes.any,
  copiedCellIdx: PropTypes.any,
  draggedOverCellIdx: PropTypes.any,
  row: PropTypes.any,
  viewportColumns: PropTypes.any,
  selectedCellProps: PropTypes.any,
  onRowClick: PropTypes.any,
  rowClass: PropTypes.any,
  setDraggedOverRowIdx: PropTypes.any,
  onMouseEnter: PropTypes.any,
  top: PropTypes.any,
  'aria-rowindex': PropTypes.any,
  'aria-selected': PropTypes.any,
};

export default memo(Row);
