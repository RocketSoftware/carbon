import React from 'react';
import PropTypes from 'prop-types';
import { settings } from '@rocketsoftware/carbon-components';
import cx from 'classnames';
import { Close20, Undo20 } from '@rocketsoftware/icons-react';

const { prefix } = settings;

class TourTooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flipped: false,
    };
  }

  render() {
    const {
      title,
      description,
      nextLabel,
      prevLabel,
      onNext,
      onPrev,
      // onClose,
      disableNext,
      disablePrev,
      // disableClose,
      hideNext,
      hidePrev,
    } = this.props;

    const next = disableNext ? undefined : onNext;
    const prev = disablePrev ? undefined : onPrev;
    // const close = disableClose ? undefined : onClose;

    return (
      <div className={`${prefix}--tour-tooltip--cardflip`}>
        <div
          className={cx(`${prefix}--tour-tooltip`, {
            flipped: this.state.flipped,
          })}>
          <TooltipFace
            flip={() => this.setState({ flipped: true })}
            front={true}
            title={title}
            body={description}>
            {!(hideNext && hidePrev) && (
              <div className={`${prefix}--tour-tooltip__action-group`}>
                {!hidePrev && (
                  <button
                    onClick={prev}
                    disabled={disablePrev}
                    className={`${prefix}--btn ${prefix}--btn--secondary ${prefix}--btn--sm`}>
                    {prevLabel}
                  </button>
                )}
                {!hideNext && (
                  <button
                    onClick={next}
                    disabled={disableNext}
                    className={`${prefix}--btn ${prefix}--btn--primary ${prefix}--btn--sm`}>
                    {nextLabel}
                  </button>
                )}
              </div>
            )}
          </TooltipFace>
          <TooltipFace
            flip={() => this.setState({ flipped: false })}
            front={false}
            title={'close tour?'}
            body={'If you come back to this page, this tour will reappear'}>
            <div className={`${prefix}--tour-tooltip__action-group`}>
              <button
                onClick={prev}
                disabled={disablePrev}
                className={`${prefix}--btn ${prefix}--btn--secondary ${prefix}--btn--sm`}>
                Don't show me again
              </button>
              <button
                onClick={next}
                disabled={disableNext}
                className={`${prefix}--btn ${prefix}--btn--primary ${prefix}--btn--sm`}>
                Close for now
              </button>
            </div>
          </TooltipFace>

          {/* <div className={cx(`${prefix}--tour-tooltip__face`, `${prefix}--tour-tooltip--front`)}>
            <button
              className={`${prefix}--tour-tooltip__flip-button`}
              type="button"
              onClick={() => this.setState({ flipped: !this.state.flipped })}
              disabled={disableClose}
            >
              {this.state.flipped
                ? <Undo20 className={`${prefix}--tour-tooltip__flip--icon`} />
                : <Close20 className={`${prefix}--tour-tooltip__flip--icon`} />
              }
            </button>
            <div className={`${prefix}--tour-tooltip__title`}>{title}</div>
            <p className={`${prefix}--tour-tooltip__body`}>{description}</p>
            {!(hideNext && hidePrev) && (
              <div className={`${prefix}--tour-tooltip__action-group`}>
                {!hidePrev && (
                  <button
                    onClick={prev}
                    disabled={disablePrev}
                    className={`${prefix}--btn ${prefix}--btn--secondary ${prefix}--btn--sm`}>
                    {prevLabel}
                  </button>
                )}
                {!hideNext && (
                  <button
                    onClick={next}
                    disabled={disableNext}
                    className={`${prefix}--btn ${prefix}--btn--primary ${prefix}--btn--sm`}>
                    {nextLabel}
                  </button>
                )}
              </div>
            )}
          </div>
          <div className={cx(`${prefix}--tour-tooltip__face`, `${prefix}--tour-tooltip--back`)}>
            <button
              className={`${prefix}--tour-tooltip__flip-button`}
              type="button"
              onClick={() => {
                this.setState({ flipped: !this.state.flipped })
                close();
              }}
              disabled={disableClose}
            >
              {this.state.flipped
                ? <Undo20 className={`${prefix}--tour-tooltip__flip--icon`} />
                : <Close20 className={`${prefix}--tour-tooltip__flip--icon`} />
              }
            </button>
            <div className={`${prefix}--tour-tooltip__title`}>{title}</div>
            <p className={`${prefix}--tour-tooltip__body`}>{description}</p>
            {!(hideNext && hidePrev) && (
              <div className={`${prefix}--tour-tooltip__action-group`}>
                {!hidePrev && (
                  <button
                    onClick={prev}
                    disabled={disablePrev}
                    className={`${prefix}--btn ${prefix}--btn--secondary ${prefix}--btn--sm`}>
                    {prevLabel}
                  </button>
                )}
                {!hideNext && (
                  <button
                    onClick={next}
                    disabled={disableNext}
                    className={`${prefix}--btn ${prefix}--btn--primary ${prefix}--btn--sm`}>
                    {nextLabel}
                  </button>
                )}
              </div>
            )}
          </div> */}
        </div>
      </div>
    );
  }
}

/*
{!(hideNext && hidePrev) && (
        <div className={`${prefix}--tour-tooltip__action-group`}>
          {!hideSecondary && (
            <button
              onClick={prev}
              disabled={disableSecondary}
              className={`${prefix}--btn ${prefix}--btn--secondary ${prefix}--btn--sm`}>
              {prevLabel}
            </button>
          )}
          {!hidePrimary && (
            <button
              onClick={next}
              disabled={disablePrimary}
              className={`${prefix}--btn ${prefix}--btn--primary ${prefix}--btn--sm`}>
              {nextLabel}
            </button>
          )}
        </div>
      )}
      */

const TooltipFace = props => {
  const { front, flip, title, body } = props;
  return (
    <div
      className={cx(
        `${prefix}--tour-tooltip__face`,
        `${prefix}--tour-tooltip--${front ? 'front' : 'back'}`
      )}>
      <button
        className={`${prefix}--tour-tooltip__flip-button`}
        type="button"
        onClick={flip}>
        {front ? (
          <Close20 className={`${prefix}--tour-tooltip__flip--icon`} />
        ) : (
          <Undo20 className={`${prefix}--tour-tooltip__flip--icon`} />
        )}
      </button>
      <div className={`${prefix}--tour-tooltip__title`}>{title}</div>
      <p className={`${prefix}--tour-tooltip__body`}>{body}</p>
      {props.children}
    </div>
  );
};

TourTooltip.propTypes = {
  /**
   * Optional tooltip title
   */
  title: PropTypes.string,

  /**
   * Main tooltip content
   */
  description: PropTypes.string,

  /**
   * Value of the checkbox, if present
   */
  checked: PropTypes.bool,

  /**
   * Callback to fire when the value of the checkbox changes
   */
  onChangeChecked: PropTypes.func,

  /**
   * Optional display text for the "next" button
   */
  nextLabel: PropTypes.string,

  /**
   * Optional display text for the "previous" button
   */
  prevLabel: PropTypes.string,

  /**
   * Optional display text for the "close" button
   */
  closeLabel: PropTypes.string,

  /**
   * Optional display text for the checkbox label
   */
  checkboxLabel: PropTypes.string,

  /**
   * Optionally specify whether the "next"" button should be disabled
   */
  disableNext: PropTypes.bool,

  /**
   * Optionally specify whether the "previous" button should be disabled
   */
  disablePrev: PropTypes.bool,

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

  /**
   * Function to be called when "next" is clicked
   */
  onNext: PropTypes.func,

  /**
   * Function to be called when "prev" is clicked
   */
  onPrev: PropTypes.func,

  /**
   * Function to be called when "close" is clicked
   */
  onClose: PropTypes.func,

  /**
   * Optionally hide the checkbox
   */
  hideCheckbox: PropTypes.bool,

  /**
   * Optionally provide the initial state of checkbox
   */
  initialCheckboxValue: PropTypes.bool,
};

TourTooltip.defaultProps = {
  nextLabel: 'Next',
  prevLabel: 'Previous',
  closeLabel: 'Skip Tour',
  checkboxLabel: "Don't show tour again.",
  hideNext: false,
  hidePrev: false,
  hideClose: false,
};

export default TourTooltip;
