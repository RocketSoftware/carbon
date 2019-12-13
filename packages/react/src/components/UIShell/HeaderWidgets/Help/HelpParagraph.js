import { settings } from '@rocketsoftware/carbon-components';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const { prefix } = settings;

const HelpParagraph = ({ className: customClassName, children, id }) => {
  const className = cx(
    `${prefix}--header-panel__help--paragraph`,
    customClassName
  );
  return (
    <p id={id} className={className}>
      {children}
    </p>
  );
};

HelpParagraph.propTypes = {
  /**
   * Provides an optional class to be applied to the containing node
   */
  className: PropTypes.string,

  /**
   * Specify the text content for the paragraph
   */
  children: PropTypes.string.isRequired,

  /**
   * Specify an id to be attached to the text container element.
   */
  id: PropTypes.string,
};

export default HelpParagraph;
