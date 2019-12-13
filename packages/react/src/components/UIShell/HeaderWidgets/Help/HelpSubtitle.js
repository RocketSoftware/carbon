import { settings } from '@rocketsoftware/carbon-components';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const { prefix } = settings;

const HelpSubtitle = ({ className: customClassName, children, id }) => {
  const className = cx(
    `${prefix}--header-panel__help--subtitle`,
    customClassName
  );
  return (
    <h4 id={id} className={className}>
      {children}
    </h4>
  );
};

HelpSubtitle.propTypes = {
  /**
   * Provides an optional class to be applied to the containing node
   */
  className: PropTypes.string,

  /**
   * Specify the text content for the subtitle
   */
  children: PropTypes.string.isRequired,

  /**
   * Specify an id to be attached to the container element.
   */
  id: PropTypes.string,
};

export default HelpSubtitle;
