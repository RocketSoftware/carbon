import { settings } from '@rocketsoftware/carbon-components';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Link, { LinkPropTypes } from '../../../Link';

const { prefix } = settings;

const HelpLink = ({ className: customClassName, children, ...rest }) => {
  const className = cx(
    `${prefix}--header-panel__help--link`,
    // active??
    customClassName
  );
  return (
    <Link className={className} {...rest}>
      {children}
    </Link>
  );
};

HelpLink.propTypes = {
  ...LinkPropTypes,

  /**
   * Provides an optional class to be applied to the containing node
   */
  className: PropTypes.string,

  /**
   * Specify the text content for the link
   */
  children: PropTypes.string.isRequired,

  /**
   * Specify an id to be attached to the container element.
   */
  id: PropTypes.string,
};

export default HelpLink;
