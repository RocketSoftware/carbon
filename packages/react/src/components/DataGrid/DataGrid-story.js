import React from 'react';
import { storiesOf } from '@storybook/react';
import AllFeatures from './stories/AllFeatures';
import ColumnsReording from './stories/ColumnsReordering';
storiesOf('Pattern|DataGrid', module)
  .add('Default', () => <AllFeatures />)
  .add('Draggable Headers', () => <ColumnsReording />);
