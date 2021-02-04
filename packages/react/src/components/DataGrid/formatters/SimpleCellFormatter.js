import PropTypes from 'prop-types';
import React from 'react';

export function SimpleCellFormatter({ row, column }) {
  const value = row[column.key];
  return <span title={String(value)}>{value}</span>;
}
SimpleCellFormatter.propTypes = {
  row: PropTypes.any,
  column: PropTypes.any,
};
