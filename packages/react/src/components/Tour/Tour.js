import React from 'react';
import { Walktour } from 'walktour';
import TourTooltip from '../TourTooltip';
import PropTypes, { object } from 'prop-types';

export default class Tour extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Walktour
        {...this.props}
        customTooltipRenderer={logic => {
          const {
            title,
            description,
            disableClose,
            disableNext,
            disablePrev,
            nextLabel,
            prevLabel,
            closeLabel,
          } = logic.stepContent;

          return (
            <TourTooltip
              onNext={logic.next}
              onPrev={logic.prev}
              onClose={logic.close}
              description={description}
              title={title}
              disableClose={disableClose}
              disableNext={disableNext}
              disablePrev={disablePrev}
              nextLabel={nextLabel}
              prevLabel={prevLabel}
              closeLabel={closeLabel}
            />
          );
        }}
      />
    );
  }
}

Tour.propTypes = {
  /**
   * An array of steps that the tour should follow
   */
  steps: PropTypes.arrayOf(object),

  /**
   * Optionally specify whether the "next"" button should be hidden
   */
  hideNext: PropTypes.bool,

  /**
   * Optionally specify whether the "previous" button should be hidden
   */
  hidePrev: PropTypes.bool,

  /**
   * Optionally specify whether the "close" button should be hidden
   */
  hideClose: PropTypes.bool,
};
