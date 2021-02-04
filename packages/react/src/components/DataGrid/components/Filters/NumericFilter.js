import PropTypes from 'prop-types';
import React from 'react';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

const RuleType = {
  Numbe: 1,
  Range: 2,
  GreaterThan: 3,
  LessThan: 4,
};

export function NumericFilter({ value, column, onChange }) {
  /** Validates the input */
  function handleKeyDown(event) {
    const result = /[><,0-9-]/.test(event.key);
    if (result === false) {
      event.preventDefault();
    }
  }

  function handleChange(event) {
    const { value } = event.target;
    const filters = getRules(value);
    onChange({
      filterTerm: filters.length > 0 ? filters : null,
      column,
      rawValue: value,
      filterValues,
    });
  }

  const tooltipText =
    'Input Methods: Range (x-y), Greater Than (>x), Less Than (<y)';

  return (
    <div className={`${prefix}--rdg-filter-container`}>
      <input
        value={value?.rawValue ?? ''}
        className={`${prefix}--rdg-filter`}
        placeholder="e.g. 3,10-15,>20"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <span style={{ paddingLeft: 4, cursor: 'help' }} title={tooltipText}>
        ?
      </span>
    </div>
  );
}

function filterValues(row, columnFilter, columnKey) {
  if (columnFilter.filterTerm == null) {
    return true;
  }

  // implement default filter logic
  const value = parseInt(row[columnKey], 10);
  for (const ruleKey in columnFilter.filterTerm) {
    const rule = columnFilter.filterTerm[ruleKey];

    switch (rule.type) {
      case RuleType.Number:
        if (rule.value === value) {
          return true;
        }
        break;
      case RuleType.GreaterThan:
        if (rule.value <= value) {
          return true;
        }
        break;
      case RuleType.LessThan:
        if (rule.value >= value) {
          return true;
        }
        break;
      case RuleType.Range:
        if (rule.begin <= value && rule.end >= value) {
          return true;
        }
        break;
      default:
        break;
    }
  }

  return false;
}

export function getRules(value) {
  if (value === '') {
    return [];
  }

  // handle each value with comma
  return value.split(',').map((str) => {
    // handle dash
    const dashIdx = str.indexOf('-');
    if (dashIdx > 0) {
      const begin = parseInt(str.slice(0, dashIdx), 10);
      const end = parseInt(str.slice(dashIdx + 1), 10);
      return { type: RuleType.Range, begin, end };
    }

    // handle greater then
    if (str.includes('>')) {
      const begin = parseInt(str.slice(str.indexOf('>') + 1), 10);
      return { type: RuleType.GreaterThan, value: begin };
    }

    // handle less then
    if (str.includes('<')) {
      const end = parseInt(str.slice(str.indexOf('<') + 1), 10);
      return { type: RuleType.LessThan, value: end };
    }

    // handle normal values
    const numericValue = parseInt(str, 10);
    return { type: RuleType.Number, value: numericValue };
  });
}

NumericFilter.propTypes = {
  value: PropTypes.any,
  column: PropTypes.any,
  onChange: PropTypes.any,
};
