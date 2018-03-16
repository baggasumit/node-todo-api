const pick = (obj, keys) => {
  let pickedObj = {};
  for (let key of keys) {
    if (obj.hasOwnProperty(key)) {
      pickedObj[key] = obj[key];
    }
  }
  return pickedObj;
};

module.exports = {
  pick,
};
