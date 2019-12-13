import { settings } from '@rocketsoftware/carbon-components';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const { prefix } = settings;

const HelpTitle = ({ className: customClassName, children, id }) => {
  const className = cx(`${prefix}--header-panel__help--title`, customClassName);
  return (
    <h3 id={id} className={className}>
      {children}
    </h3>
  );
};

HelpTitle.propTypes = {
  /**
   * Provides an optional class to be applied to the containing node
   */
  className: PropTypes.string,

  /**
   * Specify the text content for the title
   */
  children: PropTypes.string.isRequired,

  /**
   * Specify an id to be attached to the container element.
   */
  id: PropTypes.string,
};

export default HelpTitle;
