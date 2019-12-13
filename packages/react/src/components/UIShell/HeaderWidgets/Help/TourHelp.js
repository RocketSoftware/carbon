import { settings } from '@rocketsoftware/carbon-components';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const { prefix } = settings;

const TourHelp = ({ className: customClassName, children, id }) => {
  const className = cx(
    [`${prefix}--header-panel__help--tour`],
    customClassName
  );
  return (
    <div id={id} className={className}>
      {children}
    </div>
  );
};

TourHelp.propTypes = {
  /**
   * Provides an optional class to be applied to the containing node
   */
  className: PropTypes.string,

  /**
   * Specify the elements that make up the help content.
   */
  children: PropTypes.node.isRequired,

  /**
   * Specify an id to be attached to the container element.
   */
  id: PropTypes.string,
};

export default TourHelp;
