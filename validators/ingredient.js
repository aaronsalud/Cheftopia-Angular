const Validator = require('validator');
const isEmpty = require('./is-empty');
module.exports = function validateIngredientInput(data) {
  let errors = {};

  const key_attributes = ['name', 'amount'];

  key_attributes.forEach(key => {
    data[key] = !isEmpty(data[key]) ? data[key] : '';
  });

  if (!Validator.isInt(data.amount)) {
    errors.amount = 'Amount field does not contain a valid amount';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (Validator.isEmpty(data.amount)) {
    errors.amount = 'Amount field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};