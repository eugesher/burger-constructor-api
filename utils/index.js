function getPrice(value) {
  return `RUB ${(value / 100).toFixed(2)}`;
}

function setPrice(value) {
  return value * 100;
}

function setName(value) {
  return value.trim().toLowerCase();
}

module.exports = { getPrice, setPrice, setName };
