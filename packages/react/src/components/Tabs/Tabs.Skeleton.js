/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

const tab = (
  <li className={`${prefix}--tabs__nav-item`}>
    <div className={`${prefix}--tabs__nav-link`}>&nbsp;</div>
  </li>
);

function TabsSkeleton() {
  return (
    <div className={`${prefix}--tabs ${prefix}--skeleton`}>
      <div className={`${prefix}--tabs-trigger`}>
        <div className={`${prefix}--tabs-trigger-text`}>&nbsp;</div>
        <svg width="10" height="5" viewBox="0 0 10 5" fillRule="evenodd">
          <path d="M10 0L5 5 0 0z" />
        </svg>
      </div>
      <ul className={`${prefix}--tabs__nav ${prefix}--tabs__nav--hidden`}>
        {tab}
        {tab}
        {tab}
        {tab}
      </ul>
    </div>
  );
}

export default TabsSkeleton;
