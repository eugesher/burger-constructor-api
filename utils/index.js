const schemaOptions = { toJSON: { getters: true }, id: false };

function getPrice(value) {
  return Number((value / 100).toFixed(2));
}

function setPrice(value) {
  return value * 100;
}

function setName(value) {
  return value.trim().toLowerCase();
}

module.exports = {
  schemaOptions, getPrice, setPrice, setName,
};