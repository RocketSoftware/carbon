/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

const item = (
  <div className={`${prefix}--breadcrumb-item`}>
    <span className={`${prefix}--link`}>&nbsp;</span>
  </div>
);

function BreadcrumbSkeleton() {
  return (
    <div className={`${prefix}--breadcrumb ${prefix}--skeleton`}>
      {item}
      {item}
      {item}
    </div>
  );
}

export default BreadcrumbSkeleton;
