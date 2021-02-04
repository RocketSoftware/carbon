import PropTypes from 'prop-types';
import React, { memo } from 'react';

import SummaryCell from './SummaryCell';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

function SummaryRow({
  rowIdx,
  lastFrozenColumnIndex,
  row,
  viewportColumns,
  bottom,
  'aria-rowindex': ariaRowIndex,
}) {
  return (
    <div
      role="row"
      aria-rowindex={ariaRowIndex}
      className={`${prefix}--rdg-row ${prefix}--rdg-row-${
        rowIdx % 2 === 0 ? 'even' : 'odd'
      } ${prefix}--rdg-summary-row`}
      style={{ bottom }}>
      {viewportColumns.map((column) => (
        <SummaryCell
          key={column.key}
          column={column}
          lastFrozenColumnIndex={lastFrozenColumnIndex}
          row={row}
        />
      ))}
    </div>
  );
}

SummaryRow.propTypes = {
  rowIdx: PropTypes.any,
  lastFrozenColumnIndex: PropTypes.number,
  row: PropTypes.any,
  viewportColumns: PropTypes.any,
  bottom: PropTypes.any,
  'aria-rowindex': PropTypes.string,
};

export default memo(SummaryRow);
