import PropTypes from 'prop-types';
import React, { memo } from 'react';
import cx from 'classnames';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

function SummaryCell({ column, lastFrozenColumnIndex, row }) {
  const {
    summaryFormatter: SummaryFormatter,
    width,
    left,
    summaryCellClass,
  } = column;
  const className = cx(
    `${prefix}--rdg-cell`,
    {
      [`${prefix}--rdg-cell-frozen`]: column.frozen,
      [`${prefix}--rdg-cell-frozen-last`]: column.idx === lastFrozenColumnIndex,
    },
    typeof summaryCellClass === 'function'
      ? summaryCellClass(row)
      : summaryCellClass
  );

  return (
    <div
      role="gridcell"
      aria-colindex={column.idx + 1}
      className={className}
      style={{ width, left }}>
      {SummaryFormatter && <SummaryFormatter column={column} row={row} />}
    </div>
  );
}

SummaryCell.propTypes = {
  column: PropTypes.any,
  lastFrozenColumnIndex: PropTypes.any,
  row: PropTypes.any,
};

export default memo(SummaryCell);
