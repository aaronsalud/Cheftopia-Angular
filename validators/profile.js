const Validator = require('validator');
const isEmpty = require('./is-empty');
module.exports = function validateProfileInput(data) {
  let errors = {};

  const field_attributes = ['occupation', 'bio', 'website'];

  field_attributes.forEach(field => {
    data[field] = !isEmpty(data[field]) ? data[field] : '';
  });

  if (!isEmpty(data.website) && !Validator.isURL(data.website)) {
    errors.website = 'Website is not a valid Url';
  }

  if (Validator.isEmpty(data.occupation)) {
    errors.occupation = 'Occupation field is required';
  }

  if (Validator.isEmpty(data.bio)) {
    errors.bio = 'Bio field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
