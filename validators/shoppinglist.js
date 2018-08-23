const Validator = require('validator');
const isEmpty = require('./is-empty');
module.exports = function validateShoppingListInput(data) {
  let errors = {};

  const key_attributes = ['name', 'description'];

  key_attributes.forEach(key => {
    data[key] = !isEmpty(data[key]) ? data[key] : '';
  });

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }
  if (Validator.isEmpty(data.description)) {
    errors.description = 'Description field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
