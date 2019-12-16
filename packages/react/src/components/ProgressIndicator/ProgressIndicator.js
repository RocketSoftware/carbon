/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { settings } from '@rocketsoftware/carbon-components';
import {
  CheckmarkOutline16,
  Warning16,
  CircleDash32,
} from '@rocketsoftware/icons-react';
import { keys, matches } from '../../internal/keyboard';

const { prefix } = settings;
const defaultRenderLabel = props => <p {...props} />;
export const ProgressStep = ({ ...props }) => {
  const {
    label,
    description,
    className,
    current,
    complete,
    invalid,
    secondaryLabel,
    disabled,
    skip,
    onClick,
    renderLabel: ProgressStepLabel,
  } = props;

  const classes = classnames({
    [`${prefix}--progress-step`]: true,
    [`${prefix}--progress-step--current`]: current,
    [`${prefix}--progress-step--complete`]: complete,
    [`${prefix}--progress-step--incomplete`]: !complete && !current,
    [`${prefix}--progress-step--disabled`]: disabled,
    [className]: className,
  });

  const handleKeyDown = e => {
    if (matches(e, [keys.Enter, keys.Space])) {
      onClick();
    }
  };

  const SVGIcon = ({
    complete,
    current,
    description,
    invalid,
    skip,
    prefix,
  }) => {
    if (invalid) {
      return <Warning16 className={`${prefix}--progress__warning`} />;
    }
    if (skip) {
      return (
        <CircleDash32>
          <title>{description}</title>
        </CircleDash32>
      );
    }
    if (current) {
      return (
        <svg>
          <path d="M 7, 7 m -7, 0 a 7,7 0 1,0 14,0 a 7,7 0 1,0 -14,0" />
          <title>{description}</title>
        </svg>
      );
    }
    if (complete) {
      return (
        <CheckmarkOutline16>
          <title>{description}</title>
        </CheckmarkOutline16>
      );
    }
    return (
      <svg>
        <title>{description}</title>
        <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 13c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" />
      </svg>
    );
  };

  return (
    <li className={classes} aria-disabled={disabled}>
      <div
        className={classnames(`${prefix}--progress-step-button`, {
          [`${prefix}--progress-step-button--unclickable`]: !onClick || current,
        })}
        role="button"
        tabIndex={!current && onClick ? 0 : -1}
        onClick={!current ? onClick : undefined}
        onKeyDown={handleKeyDown}>
        <SVGIcon
          complete={complete}
          current={current}
          description={description}
          invalid={invalid}
          skip={skip}
          prefix={prefix}
        />
        <ProgressStepLabel className={`${prefix}--progress-label`}>
          {label}
        </ProgressStepLabel>
        {secondaryLabel !== null && secondaryLabel !== undefined ? (
          <p className={`${prefix}--progress-optional`}>{secondaryLabel}</p>
        ) : null}
        <span className={`${prefix}--progress-line`} />
      </div>
    </li>
  );
};

ProgressStep.propTypes = {
  /**
   * Index of the current step within the ProgressIndicator
   */
  index: PropTypes.number,

  /**
   * Provide the label for the <ProgressStep>
   */
  label: PropTypes.node.isRequired,

  /**
   * Provide an optional className to be applied to the containing <li> node
   */
  className: PropTypes.string,

  /**
   * Specify whether the step is the current step
   */
  current: PropTypes.bool,

  /**
   * Specify whether the step has been completed
   */
  complete: PropTypes.bool,

  /**
   * Provide a description for the <ProgressStep>
   */
  description: PropTypes.string,

  /**
   * Specify whether the step is invalid
   */
  invalid: PropTypes.bool,

  /**
   * Provide an optional secondary label
   */
  secondaryLabel: PropTypes.string,

  /*
   * An optional parameter to allow for overflow content to be rendered in a
   * tooltip.
   */
  renderLabel: PropTypes.func,

  /**
   * Provide the props that describe a progress step tooltip
   */
  overflowTooltipProps: PropTypes.object,

  /**
   * Specify whether the step is disabled
   */
  disabled: PropTypes.bool,

  /**
   * Specify whether the step is skipped
   */
  skip: PropTypes.bool,

  /**
   * The ID of the tooltip content.
   */
  tooltipId: PropTypes.string,

  /**
   * A callback called if the step is clicked or the enter key is pressed
   */
  onClick: PropTypes.func,
};

ProgressStep.defaultProps = {
  renderLabel: defaultRenderLabel,
};

export class ProgressIndicator extends Component {
  state = {};

  static propTypes = {
    /**
     * Provide <ProgressStep> components to be rendered in the
     * <ProgressIndicator>
     */
    children: PropTypes.node,

    /**
     * Provide an optional className to be applied to the containing node
     */
    className: PropTypes.string,

    /**
     * Optionally specify the current step array index
     */
    currentIndex: PropTypes.number,

    /**
     * Optional callback called if a ProgressStep is clicked on.  Returns the index of the step.
     */
    onChange: PropTypes.func,
  };

  static defaultProps = {
    currentIndex: 0,
  };

  static getDerivedStateFromProps({ currentIndex }, state) {
    const { prevCurrentIndex } = state;
    return prevCurrentIndex === currentIndex
      ? null
      : {
          currentIndex,
          prevCurrentIndex: currentIndex,
        };
  }

  renderSteps = () => {
    const { onChange } = this.props;

    return React.Children.map(this.props.children, (child, index) => {
      // only setup click handlers if onChange event is passed
      const onClick = onChange ? () => onChange(index) : undefined;
      if (index === this.state.currentIndex) {
        return React.cloneElement(child, {
          current: true,
          index,
          onClick,
        });
      }
      if (index < this.state.currentIndex) {
        return React.cloneElement(child, {
          complete: true,
          index,
          onClick,
        });
      }
      if (index > this.state.currentIndex) {
        return React.cloneElement(child, {
          complete: false,
          index,
          onClick,
        });
      }
      return null;
    });
  };

  render() {
    const { className, currentIndex, ...other } = this.props; // eslint-disable-line no-unused-vars
    const classes = classnames({
      [`${prefix}--progress`]: true,
      [className]: className,
    });
    return (
      <ul className={classes} {...other}>
        {this.renderSteps()}
      </ul>
    );
  }
}
