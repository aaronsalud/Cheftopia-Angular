const getValuesByKey = (values, key) => {
  let arr = [];
  values.map(value => {
    if (value[key]) {
      arr.push(value[key]);
    }
  });
  return arr;
};

module.exports = getValuesByKey;
