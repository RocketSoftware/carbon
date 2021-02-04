import PropTypes from 'prop-types';
import React, { createElement, memo } from 'react';
import cx from 'classnames';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

function FilterRow({
  columns,
  lastFrozenColumnIndex,
  filters,
  onFiltersChange,
}) {
  function onChange(key, value) {
    const newFilters = { ...filters };
    newFilters[key] = value;
    onFiltersChange?.(newFilters);
  }

  return (
    <div role="row" aria-rowindex={2} className="rdg-filter-row">
      {columns.map((column) => {
        const { key } = column;

        const className = cx(`${prefix}--rdg-cell`, {
          [`${prefix}--rdg-cell-frozen`]: column.frozen,
          [`${prefix}--rdg-cell-frozen-last`]:
            column.idx === lastFrozenColumnIndex,
        });
        const style = {
          width: column.width,
          left: column.left,
        };

        return (
          <div key={key} style={style} className={className}>
            {column.filterRenderer &&
              createElement(column.filterRenderer, {
                column,
                value: filters?.[column.key],
                onChange: (value) => onChange(key, value),
              })}
          </div>
        );
      })}
    </div>
  );
}

FilterRow.propTypes = {
  columns: PropTypes.any,
  lastFrozenColumnIndex: PropTypes.any,
  filters: PropTypes.any,
  onFiltersChange: PropTypes.any,
};

export default memo(FilterRow);
