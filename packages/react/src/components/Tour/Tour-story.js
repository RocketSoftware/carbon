import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Tour from '../Tour';

const targets = (
  <>
    <div
      id="one"
      style={{
        position: 'absolute',
        left: 20,
        top: 20,
        background: 'magenta',
        width: 40,
        height: 40,
      }}></div>

    <button id="two" style={{ position: 'relative', left: 200 }}>
      I am a button!
    </button>
  </>
);

storiesOf('Tour', module).add('default', () => (
  <>
    {targets}
    <Tour
      customCloseFunc={() => action('tour closed')}
      steps={[
        {
          selector: '#one',
          title: 'Welcome To The Tour',
          description:
            'Use this component to point out new or important features.',
        },
        {
          selector: '#two',
          description: 'You can interact with the elements being highlighted.',
        },
      ]}
    />
  </>
));
