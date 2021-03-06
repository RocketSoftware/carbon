import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { settings } from '@rocketsoftware/carbon-components';
import {
  View16,
  ViewOff16,
  WarningAltFilled16,
  WarningFilled16,
} from '@rocketsoftware/icons-react';
import { textInputProps } from './util';
import { FormContext } from '../FluidForm';

const { prefix } = settings;

const PasswordInput = React.forwardRef(function PasswordInput(
  {
    labelText,
    className,
    disabled,
    id,
    placeholder,
    onChange,
    onClick,
    hideLabel,
    inline,
    invalid,
    invalidText,
    helperText,
    light,
    tooltipPosition = 'bottom',
    tooltipAlignment = 'center',
    type = 'password',
    hidePasswordLabel = 'Hide password',
    showPasswordLabel = 'Show password',
    size,
    onTogglePasswordVisibility,
    warn,
    warnText,
    ...other
  },
  ref
) {
  const [inputType, setInputType] = useState(type);
  const handleTogglePasswordVisibility = (event) => {
    setInputType(inputType === 'password' ? 'text' : 'password');
    onTogglePasswordVisibility && onTogglePasswordVisibility(event);
  };
  const errorId = id + '-error-msg';
  const warnId = id + '-warn-msg';
  const textInputClasses = classNames(
    `${prefix}--text-input`,
    `${prefix}--password-input`,
    className,
    {
      [`${prefix}--text-input--light`]: light,
      [`${prefix}--text-input--invalid`]: invalid,
      [`${prefix}--text-input--${size}`]: size,
    }
  );
  const sharedTextInputProps = {
    id,
    onChange: (evt) => {
      if (!disabled) {
        onChange(evt);
      }
    },
    onClick: (evt) => {
      if (!disabled) {
        onClick(evt);
      }
    },
    placeholder,
    type: inputType,
    className: textInputClasses,
    ref,
    ...other,
  };
  const inputWrapperClasses = classNames(
    `${prefix}--form-item`,
    `${prefix}--text-input-wrapper`,
    `${prefix}--password-input-wrapper`,
    {
      [`${prefix}--text-input-wrapper--light`]: light,
      [`${prefix}--text-input-wrapper--inline`]: inline,
    }
  );
  const labelClasses = classNames(`${prefix}--label`, {
    [`${prefix}--visually-hidden`]: hideLabel,
    [`${prefix}--label--disabled`]: disabled,
    [`${prefix}--label--inline`]: inline,
    [`${prefix}--label--inline--${size}`]: inline && !!size,
  });
  const helperTextClasses = classNames(`${prefix}--form__helper-text`, {
    [`${prefix}--form__helper-text--disabled`]: disabled,
    [`${prefix}--form__helper-text--inline`]: inline,
  });
  const fieldOuterWrapperClasses = classNames(
    `${prefix}--text-input__field-outer-wrapper`,
    {
      [`${prefix}--text-input__field-outer-wrapper--inline`]: inline,
    }
  );
  const fieldWrapperClasses = classNames(
    `${prefix}--text-input__field-wrapper`,
    {
      [`${prefix}--text-input__field-wrapper--warning`]: !invalid && warn,
    }
  );
  const label = labelText ? (
    <label htmlFor={id} className={labelClasses}>
      {labelText}
    </label>
  ) : null;

  let error = null;
  if (invalid) {
    error = (
      <div className={`${prefix}--form-requirement`} id={errorId}>
        {invalidText}
      </div>
    );
  } else if (warn) {
    error = (
      <div className={`${prefix}--form-requirement`} id={warnId}>
        {warnText}
      </div>
    );
  }

  const passwordIsVisible = inputType === 'text';
  const passwordVisibilityIcon = passwordIsVisible ? (
    <ViewOff16 className={`${prefix}--icon-visibility-off`} />
  ) : (
    <View16 className={`${prefix}--icon-visibility-on`} />
  );
  const passwordVisibilityToggleClasses = classNames(
    `${prefix}--text-input--password__visibility__toggle`,
    `${prefix}--btn`,
    `${prefix}--btn--icon-only`,
    `${prefix}--tooltip__trigger`,
    `${prefix}--tooltip--a11y`,
    {
      [`${prefix}--btn--disabled`]: disabled,
      [`${prefix}--tooltip--${tooltipPosition}`]: tooltipPosition,
      [`${prefix}--tooltip--align-${tooltipAlignment}`]: tooltipAlignment,
    }
  );
  const input = (
    <>
      <input
        {...textInputProps({
          invalid,
          sharedTextInputProps,
          errorId,
          warn,
          warnId,
        })}
        disabled={disabled}
        data-toggle-password-visibility={inputType === 'password'}
      />
      <button
        type="button"
        className={passwordVisibilityToggleClasses}
        disabled={disabled}
        onClick={handleTogglePasswordVisibility}>
        {!disabled && (
          <span className={`${prefix}--assistive-text`}>
            {passwordIsVisible ? hidePasswordLabel : showPasswordLabel}
          </span>
        )}
        {passwordVisibilityIcon}
      </button>
    </>
  );
  const helper = helperText ? (
    <div className={helperTextClasses}>{helperText}</div>
  ) : null;

  const { isFluid } = useContext(FormContext);

  useEffect(() => {
    setInputType(type);
  }, [type]);

  return (
    <div className={inputWrapperClasses}>
      {!inline ? (
        label
      ) : (
        <div className={`${prefix}--text-input__label-helper-wrapper`}>
          {label}
          {!isFluid && helper}
        </div>
      )}
      <div className={fieldOuterWrapperClasses}>
        <div className={fieldWrapperClasses} data-invalid={invalid || null}>
          {invalid && (
            <WarningFilled16
              className={`${prefix}--text-input__invalid-icon`}
            />
          )}
          {!invalid && warn && (
            <WarningAltFilled16
              className={`${prefix}--text-input__invalid-icon ${prefix}--text-input__invalid-icon--warning`}
            />
          )}
          {input}
          {isFluid && !inline && error}
        </div>
        {!isFluid && error}
        {!invalid && !warn && !isFluid && !inline && helper}
      </div>
    </div>
  );
});

PasswordInput.propTypes = {
  /**
   * Provide a custom className that is applied directly to the underlying
   * `<input>` node
   */
  className: PropTypes.string,

  /**
   * Optionally provide the default value of the `<input>`
   */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Specify whether the control is disabled
   */
  disabled: PropTypes.bool,

  /**
   * Provide text that is used alongside the control label for additional help
   */
  helperText: PropTypes.node,

  /**
   * Specify whether or not the underlying label is visually hidden
   */
  hideLabel: PropTypes.bool,

  /**
   * "Hide password" tooltip text on password visibility toggle
   */
  hidePasswordLabel: PropTypes.string,

  /**
   * Provide a unique identifier for the input field
   */
  id: PropTypes.string.isRequired,

  /**
   * `true` to use the inline version.
   */
  inline: PropTypes.bool,

  /**
   * Specify whether the control is currently invalid
   */
  invalid: PropTypes.bool,

  /**
   * Provide the text that is displayed when the control is in an invalid state
   */
  invalidText: PropTypes.node,

  /**
   * Provide the text that will be read by a screen reader when visiting this
   * control
   */
  labelText: PropTypes.node.isRequired,

  /**
   * Specify light version or default version of this control
   */
  light: PropTypes.bool,

  /**
   * Optionally provide an `onChange` handler that is called whenever `<input>`
   * is updated
   */
  onChange: PropTypes.func,

  /**
   * Optionally provide an `onClick` handler that is called whenever the
   * `<input>` is clicked
   */
  onClick: PropTypes.func,

  /**
   * Callback function that is called whenever the toggle password visibility
   * button is clicked
   */
  onTogglePasswordVisibility: PropTypes.func,

  /**
   * Specify the placeholder attribute for the `<input>`
   */
  placeholder: PropTypes.string,

  /**
   * "Show password" tooltip text on password visibility toggle
   */
  showPasswordLabel: PropTypes.string,

  /**
   * Specify the size of the Text Input. Currently supports either `small` or `large` as an option. If omitted, defaults to standard size
   */
  size: PropTypes.string,

  /**
   * Specify the alignment of the tooltip to the icon-only button.
   * Can be one of: start, center, or end.
   */
  tooltipAlignment: PropTypes.oneOf(['start', 'center', 'end']),

  /**
   * Specify the direction of the tooltip for icon-only buttons.
   * Can be either top, right, bottom, or left.
   */
  tooltipPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),

  /**
   * The input type, either password or text
   */
  type: PropTypes.oneOf(['password', 'text']),

  /**
   * Provide the current value of the `<input>`
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Specify whether the control is currently in warning state
   */
  warn: PropTypes.bool,

  /**
   * Provide the text that is displayed when the control is in warning state
   */
  warnText: PropTypes.node,
};

PasswordInput.defaultProps = {
  className: '${prefix}--text__input',
  disabled: false,
  onChange: () => {},
  onClick: () => {},
  invalid: false,
  invalidText: '',
  helperText: '',
  light: false,
  size: '',
};

export default PasswordInput;
