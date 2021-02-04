import React from 'react';

export function ValueFormatter(props) {
  return <>{props.row[props.column.key]}</>;
}
