export function getPrice(value) {
  return (value / 100).toFixed(2);
}

export function setPrice(value) {
  return value * 100;
}
