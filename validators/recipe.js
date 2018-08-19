const Validator = require('validator');
const isEmpty = require('./is-empty');
module.exports = function validateRecipeInput(data) {
  let errors = {};

  const key_attributes = ['name', 'image', 'description'];

  key_attributes.forEach(key => {
    data[key] = !isEmpty(data[key]) ? data[key] : '';
  });

  if (!Validator.isURL(data.image)) {
    errors.image = 'Image field does not contain a valid url';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (Validator.isEmpty(data.image)) {
    errors.image = 'Image Url field is required';
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = 'Description field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
