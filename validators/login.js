const Validator = require('validator');
const isEmpty = require('./is-empty');
module.exports = function validateLoginInput(data) {
  let errors = {};

  const key_attributes = ['email', 'password'];

  key_attributes.forEach(key => {
    data[key] = !isEmpty(data[key]) ? data[key] : '';
  });

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email field does not contain a valid email address';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};