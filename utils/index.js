const schemaOptions = { toJSON: { getters: true }, id: false };
const burgerIngredientLimits = {
  buns: 1,
  cutlets: 2,
  cheeses: 3,
  vegetables: 3,
  sauces: 3,
};

function getPrice(value) {
  return Number((value / 100).toFixed(2));
}

function setPrice(value) {
  return Math.ceil(value * 100);
}

function setName(value) {
  return value.trim().toLowerCase();
}

function concatenateErrorMessages(err) {
  return Object.values(err.errors).map((e) => e.message).join('. ');
}

module.exports = {
  schemaOptions,
  burgerIngredientLimits,
  getPrice,
  setPrice,
  setName,
  concatenateErrorMessages,
};
