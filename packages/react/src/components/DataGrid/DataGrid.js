import PropTypes from 'prop-types';
import React, {
  forwardRef,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useImperativeHandle,
  useCallback,
  createElement,
} from 'react';
import cx from 'classnames';

import { useGridWidth, useViewportColumns } from './hooks';
import EventBus from './EventBus';
import HeaderRow from './HeaderRow';
import FilterRow from './FilterRow';
import Row from './Row';
import SummaryRow from './SummaryRow';
import { ValueFormatter } from './formatters';
import { legacyCellInput } from './editors';
import {
  assertIsValidKey,
  getColumnScrollPosition,
  getScrollbarSize,
  getVerticalRangeToRender,
  getNextSelectedCellPosition,
  isSelectedCellEditable,
  canExitGrid,
  isCtrlKeyHeldDown,
} from './utils';

import { CellNavigationMode, UpdateActions } from './enums';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

/**
 * Main API Component to render a data grid of rows and columns
 *
 * @example
 *
 * <DataGrid columns={columns} rows={rows} />
 */
function DataGrid(
  {
    // Grid and data Props
    columns: rawColumns,
    rows,
    summaryRows,
    rowKey,
    onRowsUpdate,
    // Dimensions props
    width,
    height = 350,
    minColumnWidth = 80,
    rowHeight = 35,
    headerRowHeight = rowHeight,
    headerFiltersHeight = 45,
    // Feature props
    selectedRows,
    onSelectedRowsChange,
    sortColumn,
    sortDirection,
    onSort,
    filters,
    onFiltersChange,
    // Custom renderers
    defaultFormatter = ValueFormatter,
    rowRenderer: RowRenderer = Row,
    emptyRowsRenderer,
    // Event props
    onRowClick,
    onScroll,
    onColumnResize,
    onSelectedCellChange,
    onCheckCellIsEditable,
    // Toggles and modes
    enableFilters = false,
    enableCellCopyPaste = false,
    enableCellDragAndDrop = false,
    cellNavigationMode = CellNavigationMode.NONE,
    // Miscellaneous
    editorPortalTarget = document.body,
    rowClass,
    // ARIA
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
  },
  ref
) {
  /**
   * states
   */
  const [eventBus] = useState(() => new EventBus());
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [columnWidths, setColumnWidths] = useState(() => new Map());
  const [selectedPosition, setSelectedPosition] = useState({
    idx: -1,
    rowIdx: -1,
    mode: 'SELECT',
  });
  const [copiedPosition, setCopiedPosition] = useState(null);
  const [isDragging, setDragging] = useState(false);
  const [draggedOverRowIdx, setOverRowIdx] = useState(undefined);

  const setDraggedOverRowIdx = useCallback((rowIdx) => {
    setOverRowIdx(rowIdx);
    latestDraggedOverRowIdx.current = rowIdx;
  }, []);

  /**
   * refs
   */
  const focusSinkRef = useRef(null);
  const prevSelectedPosition = useRef(selectedPosition);
  const latestDraggedOverRowIdx = useRef(draggedOverRowIdx);
  const lastSelectedRowIdx = useRef(-1);

  /**
   * computed values
   */
  const [gridRef, gridWidth] = useGridWidth(width);
  const viewportWidth = gridWidth - 2; // 2 for border width;
  const headerRowsCount = enableFilters ? 2 : 1;
  const summaryRowsCount = summaryRows?.length ?? 0;
  const isSelectable =
    selectedRows !== undefined && onSelectedRowsChange !== undefined;

  const {
    columns,
    viewportColumns,
    totalColumnWidth,
    lastFrozenColumnIndex,
  } = useViewportColumns({
    columns: rawColumns,
    minColumnWidth,
    columnWidths,
    defaultFormatter,
    scrollLeft,
    viewportWidth,
  });

  const totalHeaderHeight =
    headerRowHeight + (enableFilters ? headerFiltersHeight : 0);
  const clientHeight =
    height -
    2 - // border width
    totalHeaderHeight -
    summaryRowsCount * rowHeight -
    (totalColumnWidth > viewportWidth ? getScrollbarSize() : 0);

  const [rowOverscanStartIdx, rowOverscanEndIdx] = getVerticalRangeToRender(
    clientHeight,
    rowHeight,
    scrollTop,
    rows.length
  );

  /**
   * effects
   */
  useLayoutEffect(() => {
    if (
      selectedPosition === prevSelectedPosition.current ||
      selectedPosition.mode === 'EDIT' ||
      !isCellWithinBounds(selectedPosition)
    )
      return;
    prevSelectedPosition.current = selectedPosition;
    scrollToCell(selectedPosition);
    focusSinkRef.current.focus();
  });

  useEffect(() => {
    if (!onSelectedRowsChange) return;

    const handleRowSelectionChange = ({ rowIdx, checked, isShiftClick }) => {
      assertIsValidKey(rowKey);
      const newSelectedRows = new Set(selectedRows);
      const rowId = rows[rowIdx][rowKey];

      if (checked) {
        newSelectedRows.add(rowId);
        const previousRowIdx = lastSelectedRowIdx.current;
        lastSelectedRowIdx.current = rowIdx;
        if (
          isShiftClick &&
          previousRowIdx !== -1 &&
          previousRowIdx !== rowIdx
        ) {
          const step = Math.sign(rowIdx - previousRowIdx);
          for (let i = previousRowIdx + step; i !== rowIdx; i += step) {
            newSelectedRows.add(rows[i][rowKey]);
          }
        }
      } else {
        newSelectedRows.delete(rowId);
        lastSelectedRowIdx.current = -1;
      }

      onSelectedRowsChange(newSelectedRows);
    };

    return eventBus.subscribe('SELECT_ROW', handleRowSelectionChange);
  }, [eventBus, onSelectedRowsChange, rows, rowKey, selectedRows]);

  useEffect(() => {
    return eventBus.subscribe('SELECT_CELL', selectCell);
  });

  useImperativeHandle(ref, () => ({
    scrollToColumn(idx) {
      scrollToCell({ idx });
    },
    scrollToRow(rowIdx) {
      const { current } = gridRef;
      if (!current) return;
      current.scrollTop = rowIdx * rowHeight;
    },
    selectCell,
  }));

  /**
   * event handlers
   */
  function handleKeyDown(event) {
    if (
      enableCellCopyPaste &&
      isCtrlKeyHeldDown(event) &&
      isCellWithinBounds(selectedPosition)
    ) {
      // event.key may be uppercase `C` or `V`
      const lowerCaseKey = event.key.toLowerCase();
      if (lowerCaseKey === 'c') {
        handleCopy();
        return;
      }
      if (lowerCaseKey === 'v') {
        handlePaste();
        return;
      }
    }

    switch (event.key) {
      case 'Escape':
        setCopiedPosition(null);
        return;
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'Tab':
      case 'Home':
      case 'End':
      case 'PageUp':
      case 'PageDown':
        navigate(event);
        break;
      default:
        if (isCellWithinBounds(selectedPosition)) {
          handleCellInput(event);
        }
        break;
    }
  }

  function handleScroll(event) {
    const { scrollTop, scrollLeft } = event.currentTarget;
    setScrollTop(scrollTop);
    setScrollLeft(scrollLeft);
    onScroll?.(event);
  }

  const handleColumnResize = useCallback(
    (column, width) => {
      const newColumnWidths = new Map(columnWidths);
      newColumnWidths.set(column.key, width);
      setColumnWidths(newColumnWidths);

      onColumnResize?.(column.idx, width);
    },
    [columnWidths, onColumnResize]
  );

  function handleCommit({ cellKey, rowIdx, updated }) {
    onRowsUpdate?.({
      cellKey,
      fromRow: rowIdx,
      toRow: rowIdx,
      updated,
      action: UpdateActions.CELL_UPDATE,
    });

    closeEditor();
  }

  function handleCopy() {
    const { idx, rowIdx } = selectedPosition;
    const value = rows[rowIdx][columns[idx].key];
    setCopiedPosition({ idx, rowIdx, value });
  }

  function handlePaste() {
    if (
      copiedPosition === null ||
      !isCellEditable(selectedPosition) ||
      (copiedPosition.idx === selectedPosition.idx &&
        copiedPosition.rowIdx === selectedPosition.rowIdx)
    ) {
      return;
    }

    const { rowIdx: toRow } = selectedPosition;

    const cellKey = columns[selectedPosition.idx].key;
    const { rowIdx: fromRow, idx, value } = copiedPosition;
    const fromCellKey = columns[idx].key;

    onRowsUpdate?.({
      cellKey,
      fromRow,
      toRow,
      updated: { [cellKey]: value },
      action: UpdateActions.COPY_PASTE,
      fromCellKey,
    });
  }

  function handleCellInput(event) {
    const { key } = event;
    const column = columns[selectedPosition.idx];
    const row = rows[selectedPosition.rowIdx];
    const canOpenEditor =
      selectedPosition.mode === 'SELECT' && isCellEditable(selectedPosition);
    const isActivatedByUser =
      (column.unsafe_onCellInput ?? legacyCellInput)(event, row) === true;

    if (canOpenEditor && (key === 'Enter' || isActivatedByUser)) {
      setSelectedPosition(({ idx, rowIdx }) => ({
        idx,
        rowIdx,
        key,
        mode: 'EDIT',
      }));
    }
  }

  function handleDragEnd() {
    if (latestDraggedOverRowIdx.current === undefined) return;

    const { idx, rowIdx } = selectedPosition;
    const column = columns[idx];
    const cellKey = column.key;
    const value = rows[rowIdx][cellKey];

    onRowsUpdate?.({
      cellKey,
      fromRow: rowIdx,
      toRow: latestDraggedOverRowIdx.current,
      updated: { [cellKey]: value },
      action: UpdateActions.CELL_DRAG,
    });

    setDraggedOverRowIdx(undefined);
  }

  function handleMouseDown(event) {
    if (event.buttons !== 1) return;
    setDragging(true);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseup', onMouseUp);

    function onMouseOver(event) {
      // Trigger onMouseup in edge cases where we release the mouse button but `mouseup` isn't triggered,
      // for example when releasing the mouse button outside the iframe the grid is rendered in.
      // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
      if (event.buttons !== 1) onMouseUp();
    }

    function onMouseUp() {
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseup', onMouseUp);
      setDragging(false);
      handleDragEnd();
    }
  }

  function handleDoubleClick(event) {
    event.stopPropagation();

    const column = columns[selectedPosition.idx];
    const cellKey = column.key;
    const value = rows[selectedPosition.rowIdx][cellKey];

    onRowsUpdate?.({
      cellKey,
      fromRow: selectedPosition.rowIdx,
      toRow: rows.length - 1,
      updated: { [cellKey]: value },
      action: UpdateActions.COLUMN_FILL,
    });
  }

  /**
   * utils
   */
  function isCellWithinBounds({ idx, rowIdx }) {
    return (
      rowIdx >= 0 && rowIdx < rows.length && idx >= 0 && idx < columns.length
    );
  }

  function isCellEditable(position) {
    return (
      isCellWithinBounds(position) &&
      isSelectedCellEditable({
        columns,
        rows,
        selectedPosition: position,
        onCheckCellIsEditable,
      })
    );
  }

  function selectCell(position, enableEditor = false) {
    if (!isCellWithinBounds(position)) return;

    if (enableEditor && isCellEditable(position)) {
      setSelectedPosition({ ...position, mode: 'EDIT', key: null });
    } else {
      setSelectedPosition({ ...position, mode: 'SELECT' });
    }
    onSelectedCellChange?.({ ...position });
  }

  function closeEditor() {
    setSelectedPosition(({ idx, rowIdx }) => ({ idx, rowIdx, mode: 'SELECT' }));
  }

  function getFrozenColumnsWidth() {
    if (lastFrozenColumnIndex === -1) return 0;
    const lastFrozenCol = columns[lastFrozenColumnIndex];
    return lastFrozenCol.left + lastFrozenCol.width;
  }

  function scrollToCell({ idx, rowIdx }) {
    const { current } = gridRef;
    if (!current) return;

    if (typeof idx === 'number' && idx > lastFrozenColumnIndex) {
      const { clientWidth } = current;
      const { left, width } = columns[idx];
      const isCellAtLeftBoundary =
        left < scrollLeft + width + getFrozenColumnsWidth();
      const isCellAtRightBoundary = left + width > clientWidth + scrollLeft;
      if (isCellAtLeftBoundary || isCellAtRightBoundary) {
        const newScrollLeft = getColumnScrollPosition(
          columns,
          idx,
          scrollLeft,
          clientWidth
        );
        current.scrollLeft = scrollLeft + newScrollLeft;
      }
    }

    if (typeof rowIdx === 'number') {
      if (rowIdx * rowHeight < scrollTop) {
        // at top boundary, scroll to the row's top
        current.scrollTop = rowIdx * rowHeight;
      } else if ((rowIdx + 1) * rowHeight > scrollTop + clientHeight) {
        // at bottom boundary, scroll the next row's top to the bottom of the viewport
        current.scrollTop = (rowIdx + 1) * rowHeight - clientHeight;
      }
    }
  }

  function getNextPosition(key, ctrlKey, shiftKey) {
    const { idx, rowIdx } = selectedPosition;
    switch (key) {
      case 'ArrowUp':
        return { idx, rowIdx: rowIdx - 1 };
      case 'ArrowDown':
        return { idx, rowIdx: rowIdx + 1 };
      case 'ArrowLeft':
        return { idx: idx - 1, rowIdx };
      case 'ArrowRight':
        return { idx: idx + 1, rowIdx };
      case 'Tab':
        if (selectedPosition.idx === -1 && selectedPosition.rowIdx === -1) {
          return shiftKey
            ? { idx: columns.length - 1, rowIdx: rows.length - 1 }
            : { idx: 0, rowIdx: 0 };
        }
        return { idx: idx + (shiftKey ? -1 : 1), rowIdx };
      case 'Home':
        return ctrlKey ? { idx: 0, rowIdx: 0 } : { idx: 0, rowIdx };
      case 'End':
        return ctrlKey
          ? { idx: columns.length - 1, rowIdx: rows.length - 1 }
          : { idx: columns.length - 1, rowIdx };
      case 'PageUp':
        return { idx, rowIdx: rowIdx - Math.floor(clientHeight / rowHeight) };
      case 'PageDown':
        return { idx, rowIdx: rowIdx + Math.floor(clientHeight / rowHeight) };
      default:
        return selectedPosition;
    }
  }

  function navigate(event) {
    const { key, shiftKey } = event;
    const ctrlKey = isCtrlKeyHeldDown(event);
    let nextPosition = getNextPosition(key, ctrlKey, shiftKey);
    let mode = cellNavigationMode;
    if (key === 'Tab') {
      // If we are in a position to leave the grid, stop editing but stay in that cell
      if (
        canExitGrid({
          shiftKey,
          cellNavigationMode,
          columns,
          rowsCount: rows.length,
          selectedPosition,
        })
      ) {
        // Allow focus to leave the grid so the next control in the tab order can be focused
        return;
      }

      mode =
        cellNavigationMode === CellNavigationMode.NONE
          ? CellNavigationMode.CHANGE_ROW
          : cellNavigationMode;
    }

    // Do not allow focus to leave
    event.preventDefault();

    nextPosition = getNextSelectedCellPosition({
      columns,
      rowsCount: rows.length,
      cellNavigationMode: mode,
      nextPosition,
    });

    selectCell(nextPosition);
  }

  function getDraggedOverCellIdx(currentRowIdx) {
    if (draggedOverRowIdx === undefined) return;
    const { rowIdx } = selectedPosition;

    const isDraggedOver =
      rowIdx < draggedOverRowIdx
        ? rowIdx < currentRowIdx && currentRowIdx <= draggedOverRowIdx
        : rowIdx > currentRowIdx && currentRowIdx >= draggedOverRowIdx;

    return isDraggedOver ? selectedPosition.idx : undefined;
  }

  function getSelectedCellProps(rowIdx) {
    if (selectedPosition.rowIdx !== rowIdx) return;

    if (selectedPosition.mode === 'EDIT') {
      return {
        mode: 'EDIT',
        idx: selectedPosition.idx,
        onKeyDown: handleKeyDown,
        editorContainerProps: {
          editorPortalTarget,
          rowHeight,
          scrollLeft,
          scrollTop,
          firstEditorKeyPress: selectedPosition.key,
          onCommit: handleCommit,
          onCommitCancel: closeEditor,
        },
      };
    }

    return {
      mode: 'SELECT',
      idx: selectedPosition.idx,
      onKeyDown: handleKeyDown,
      dragHandleProps:
        enableCellDragAndDrop && isCellEditable(selectedPosition)
          ? { onMouseDown: handleMouseDown, onDoubleClick: handleDoubleClick }
          : undefined,
    };
  }

  function getViewportRows() {
    const rowElements = [];

    for (
      let rowIdx = rowOverscanStartIdx;
      rowIdx <= rowOverscanEndIdx;
      rowIdx++
    ) {
      const row = rows[rowIdx];
      let key = rowIdx;
      let isRowSelected = false;
      if (rowKey !== undefined) {
        const rowId = row[rowKey];
        isRowSelected = selectedRows?.has(rowId) ?? false;
        if (typeof rowId === 'string' || typeof rowId === 'number') {
          key = rowId;
        }
      }

      rowElements.push(
        <RowRenderer
          aria-rowindex={headerRowsCount + rowIdx + 1}
          aria-selected={isSelectable ? isRowSelected : undefined}
          key={key}
          rowIdx={rowIdx}
          row={row}
          viewportColumns={viewportColumns}
          lastFrozenColumnIndex={lastFrozenColumnIndex}
          eventBus={eventBus}
          isRowSelected={isRowSelected}
          onRowClick={onRowClick}
          rowClass={rowClass}
          top={rowIdx * rowHeight + totalHeaderHeight}
          copiedCellIdx={
            copiedPosition?.rowIdx === rowIdx ? copiedPosition.idx : undefined
          }
          draggedOverCellIdx={getDraggedOverCellIdx(rowIdx)}
          setDraggedOverRowIdx={isDragging ? setDraggedOverRowIdx : undefined}
          selectedCellProps={getSelectedCellProps(rowIdx)}
        />
      );
    }

    return rowElements;
  }

  // Reset the positions if the current values are no longer valid. This can happen if a column or row is removed
  if (
    selectedPosition.idx >= columns.length ||
    selectedPosition.rowIdx >= rows.length
  ) {
    setSelectedPosition({ idx: -1, rowIdx: -1, mode: 'SELECT' });
    setCopiedPosition(null);
    setDraggedOverRowIdx(undefined);
  }

  return (
    <div
      role="grid"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-multiselectable={isSelectable ? true : undefined}
      aria-colcount={columns.length}
      aria-rowcount={headerRowsCount + rows.length + summaryRowsCount}
      className={cx(`${prefix}--rdg`, {
        [`${prefix}--rdg-viewport-dragging`]: isDragging,
      })}
      style={{
        width,
        height,
        '--header-row-height': `${headerRowHeight}px`,
        '--filter-row-height': `${headerFiltersHeight}px`,
        '--row-width': `${totalColumnWidth}px`,
        '--row-height': `${rowHeight}px`,
      }}
      ref={gridRef}
      onScroll={handleScroll}>
      <HeaderRow
        rowKey={rowKey}
        rows={rows}
        columns={viewportColumns}
        onColumnResize={handleColumnResize}
        lastFrozenColumnIndex={lastFrozenColumnIndex}
        allRowsSelected={selectedRows?.size === rows.length}
        onSelectedRowsChange={onSelectedRowsChange}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={onSort}
      />
      {enableFilters && (
        <FilterRow
          lastFrozenColumnIndex={lastFrozenColumnIndex}
          columns={viewportColumns}
          filters={filters}
          onFiltersChange={onFiltersChange}
        />
      )}
      {rows.length === 0 && emptyRowsRenderer ? (
        createElement(emptyRowsRenderer)
      ) : (
        <>
          <div // eslint-disable-line jsx-a11y/no-noninteractive-element-interactions
            role="navigation"
            ref={focusSinkRef}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
            className={`${prefix}--rdg-focus-sink`}
            onKeyDown={handleKeyDown}
          />
          <div
            style={{ height: Math.max(rows.length * rowHeight, clientHeight) }}
          />
          {getViewportRows()}
          {summaryRows?.map((row, rowIdx) => (
            <SummaryRow
              aria-rowindex={headerRowsCount + rows.length + rowIdx + 1}
              key={rowIdx}
              rowIdx={rowIdx}
              row={row}
              bottom={rowHeight * (summaryRows.length - 1 - rowIdx)}
              viewportColumns={viewportColumns}
              lastFrozenColumnIndex={lastFrozenColumnIndex}
            />
          ))}
        </>
      )}
    </div>
  );
}

DataGrid.propTypes = {
  // Grid and data Props
  columns: PropTypes.any,
  rows: PropTypes.any,
  summaryRows: PropTypes.any,
  rowKey: PropTypes.any,
  onRowsUpdate: PropTypes.any,
  // Dimensions props
  width: PropTypes.any,
  height: PropTypes.any,
  minColumnWidth: PropTypes.any,
  rowHeight: PropTypes.any,
  headerRowHeight: PropTypes.any,
  headerFiltersHeight: PropTypes.any,
  // Feature props
  selectedRows: PropTypes.any,
  onSelectedRowsChange: PropTypes.any,
  sortColumn: PropTypes.any,
  sortDirection: PropTypes.any,
  onSort: PropTypes.any,
  filters: PropTypes.any,
  onFiltersChange: PropTypes.any,
  // Custom renderers
  defaultFormatter: PropTypes.any,
  rowRenderer: PropTypes.any,
  emptyRowsRenderer: PropTypes.any,
  // Event props
  onRowClick: PropTypes.any,
  onScroll: PropTypes.any,
  onColumnResize: PropTypes.any,
  onSelectedCellChange: PropTypes.any,
  onCheckCellIsEditable: PropTypes.any,
  // Toggles and modes
  enableFilters: PropTypes.any,
  enableCellCopyPaste: PropTypes.any,
  enableCellDragAndDrop: PropTypes.any,
  cellNavigationMode: PropTypes.any,
  // Miscellaneous
  editorPortalTarget: PropTypes.any,
  rowClass: PropTypes.any,
  // ARIA
  'aria-label': PropTypes.any,
  'aria-labelledby': PropTypes.any,
  'aria-describedby': PropTypes.any,
};

export default forwardRef(DataGrid);
