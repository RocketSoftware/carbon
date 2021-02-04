import PropTypes from 'prop-types';
import React from 'react';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

export default class SimpleTextEditor extends React.Component {
  input = React.createRef();

  getInputNode() {
    return this.input.current;
  }

  getValue() {
    return {
      [this.props.column.key]: this.input.current.value,
    };
  }

  render() {
    return (
      <input
        className={`${prefix}--rdg-text-editor`}
        ref={this.input}
        defaultValue={this.props.value}
        onBlur={this.props.onCommit}
      />
    );
  }
}

SimpleTextEditor.propTypes = {
  column: PropTypes.any,
  value: PropTypes.any,
  onCommit: PropTypes.any,
};
