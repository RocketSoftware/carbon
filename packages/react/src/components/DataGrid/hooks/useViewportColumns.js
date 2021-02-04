import { useMemo } from 'react';

// import { CalculatedColumn } from '../types';
import {
  getColumnMetrics,
  getHorizontalRangeToRender,
  getViewportColumns,
} from '../utils';
// import { DataGridProps } from '../DataGrid';

// type SharedDataGridProps<R, K extends keyof R, SR> =
//   Pick<DataGridProps<R, K, SR>, 'columns'> &
//   Required<Required<Pick<DataGridProps<R, K, SR>, | 'minColumnWidth' | 'defaultFormatter'>>>;

// interface ViewportColumnsArgs<R, K extends keyof R, SR> extends SharedDataGridProps<R, K, SR> {
//   viewportWidth: number;
//   scrollLeft: number;
//   columnWidths: ReadonlyMap<string, number>;
// }

export function useViewportColumns({
  columns: rawColumns,
  minColumnWidth,
  columnWidths,
  viewportWidth,
  defaultFormatter,
  scrollLeft,
}) {
  const { columns, lastFrozenColumnIndex, totalColumnWidth } = useMemo(() => {
    return getColumnMetrics({
      columns: rawColumns,
      minColumnWidth,
      viewportWidth,
      columnWidths,
      defaultFormatter,
    });
  }, [
    columnWidths,
    rawColumns,
    defaultFormatter,
    minColumnWidth,
    viewportWidth,
  ]);

  const [colOverscanStartIdx, colOverscanEndIdx] = useMemo(() => {
    return getHorizontalRangeToRender(
      columns,
      lastFrozenColumnIndex,
      viewportWidth,
      scrollLeft
    );
  }, [scrollLeft, columns, lastFrozenColumnIndex, viewportWidth]);

  const viewportColumns = useMemo(() => {
    return getViewportColumns(columns, colOverscanStartIdx, colOverscanEndIdx);
  }, [colOverscanEndIdx, colOverscanStartIdx, columns]);

  return { columns, viewportColumns, totalColumnWidth, lastFrozenColumnIndex };
}
