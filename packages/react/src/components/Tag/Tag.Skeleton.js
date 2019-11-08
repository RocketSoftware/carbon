/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { settings } from '@rocketsoftware/carbon-components';

const { prefix } = settings;

function TagSkeleton() {
  return <span className={`${prefix}--tag ${prefix}--skeleton`} />;
}

export default TagSkeleton;
