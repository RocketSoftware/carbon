import PropTypes from 'prop-types';
import React from 'react';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

const SORT_TEXT = {
  ASC: '\u25B2',
  DESC: '\u25BC',
  NONE: '',
};

export default function SortableHeaderCell({
  column,
  onSort,
  sortColumn,
  sortDirection,
  children,
}) {
  sortDirection = (sortColumn === column.key && sortDirection) || 'NONE';
  function onClick() {
    if (!onSort) return;
    const sortDescendingFirst = column.sortDescendingFirst || false;
    let direction;
    switch (sortDirection) {
      case 'ASC':
        direction = sortDescendingFirst ? 'NONE' : 'DESC';
        break;
      case 'DESC':
        direction = sortDescendingFirst ? 'ASC' : 'NONE';
        break;
      default:
        direction = sortDescendingFirst ? 'DESC' : 'ASC';
        break;
    }
    onSort(column.key, direction);
  }

  return (
    // eslint-disable-next-line
    <span className={`${prefix}--rdg-header-sort-cell`} onClick={onClick}>
      <span className={`${prefix}--rdg-header-sort-name`}>{children}</span>
      <span>{SORT_TEXT[sortDirection]}</span>
    </span>
  );
}

SortableHeaderCell.propTypes = {
  column: PropTypes.any,
  onSort: PropTypes.any,
  sortColumn: PropTypes.any,
  sortDirection: PropTypes.any,
  children: PropTypes.any,
};
