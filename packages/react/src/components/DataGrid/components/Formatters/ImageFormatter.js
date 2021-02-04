import PropTypes from 'prop-types';
import React from 'react';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

export function ImageFormatter({ value }) {
  return (
    <div className={`${prefix}--rdg-image-cell-wrapper`}>
      <div
        className={`${prefix}--rdg-image-cell`}
        style={{ backgroundImage: `url(${value})` }}
      />
    </div>
  );
}

ImageFormatter.propTypes = {
  value: PropTypes.any,
};
