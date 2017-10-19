import React from 'react';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

export const required = value => (value ? undefined : 'Required');

export const minLength = min => value =>
  (value && value.length < min
    ? `Must be ${min} characters or more`
    : undefined);

export const email = value =>
  (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined);

// https://github.com/erikras/redux-form/issues/2282#issuecomment-270170347
const FormInput = (props) => {
  const {
    feedbackIcon,
    input,
    label,
    type,
    meta: { error, warning, touched },
    ...rest
  } = props;

  let message;
  const validationState =
    (touched && (error && 'error')) || (warning && 'warning') || null;

  if (touched && (error || warning)) {
    message = <span className="help-block">{error || warning}</span>;
  }

  return (
    <FormGroup validationState={validationState}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...input} type={type} {...rest} />
      {feedbackIcon
        ? <FormControl.Feedback>{feedbackIcon}</FormControl.Feedback>
        : null}
      {message}
    </FormGroup>
  );
};

export default FormInput;
