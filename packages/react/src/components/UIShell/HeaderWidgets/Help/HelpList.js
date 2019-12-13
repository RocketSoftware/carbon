import { settings } from '@rocketsoftware/carbon-components';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import UnorderedList from '../../../UnorderedList';

const { prefix } = settings;

const HelpList = ({ className: customClassName, children, id }) => {
  const className = cx(`${prefix}--header-panel__help--list`, customClassName);
  return (
    <UnorderedList id={id} className={className}>
      {children}
    </UnorderedList>
  );
};

HelpList.propTypes = {
  /**
   * Provides an optional class to be applied to the containing node
   */
  className: PropTypes.string,

  /**
   * Specify the text content for the list
   */
  children: PropTypes.node.isRequired,

  /**
   * Specify an optional id to be attached to the container element.
   */
  id: PropTypes.string,
};

export default HelpList;
