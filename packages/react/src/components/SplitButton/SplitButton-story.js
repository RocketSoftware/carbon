import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, select } from '@storybook/addon-knobs';
import SplitButton from '../SplitButton';
import OverflowMenuItem from '../OverflowMenuItem';

const sizes = {
  Default: 'default',
  Field: 'field',
  Small: 'small',
};

const props = {
  regular: () => {
    return {
      classNameContainer: 'some-class',
      classNameButton: 'some-class',
      classNameOverflow: 'some-class',
      size: select('Button size (size)', sizes, 'default'),
      disabled: boolean('Disabled (disabled)', false),
    };
  },
  items: () => {
    return {
      onClick: action('onClick'),
    };
  },
};

SplitButton.displayName = 'Button';

storiesOf('Button - SplitButton', module)
  .addDecorator(withKnobs)
  .add(
    'Default',
    () => {
      const regularProps = props.regular();
      const itemProps = props.items();
      return (
        <SplitButton {...regularProps}>
          <OverflowMenuItem itemText={'Item 1'} {...itemProps} />
          <OverflowMenuItem itemText={'Item 2'} {...itemProps} primaryFocus />
          <OverflowMenuItem itemText={'Item 3'} {...itemProps} />
          <OverflowMenuItem itemText={'Item 4'} {...itemProps} />
        </SplitButton>
      );
    },
    {
      info: {
        text: `
        A split button can be used to group a series of actions together into a single location on the screen, providing 
        the user with a single primary action and a small list of alternative actions. 
        `,
      },
    }
  );
