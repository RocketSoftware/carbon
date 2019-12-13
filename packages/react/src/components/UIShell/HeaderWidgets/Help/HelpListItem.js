import { settings } from '@rocketsoftware/carbon-components';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ListItem from '../../../ListItem';

const { prefix } = settings;

const HelpListItem = ({ className: customClassName, children, id }) => {
  const className = cx(
    `${prefix}--header-panel__help--list-item`,
    customClassName
  );
  return (
    <ListItem id={id} className={className}>
      {children}
    </ListItem>
  );
};

HelpListItem.propTypes = {
  /**
   * Provides an optional class to be applied to the containing node
   */
  className: PropTypes.string,

  /**
   * Specify the text content for the listitem
   */
  children: PropTypes.node.isRequired,

  /**
   * Specify an optional id to be attached to the list item.
   */
  id: PropTypes.string,
};

export default HelpListItem;
