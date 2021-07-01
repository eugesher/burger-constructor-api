const schemaOptions = { toJSON: { getters: true }, id: false };
const ingredientCategories = ['buns', 'cutlets', 'vegetables', 'sauces'];

const temporaryUserHandler = (req, res, next) => {
  req.user = {
    _id: '60d9e793860bfa3caa38d71f',
  };
  next();
};

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
  schemaOptions, ingredientCategories, temporaryUserHandler, getPrice, setPrice, setName,
};
