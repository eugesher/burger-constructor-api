const { celebrate, Joi } = require('celebrate');

const { ingredientCategories, burgerIngredientLimits } = require('../utils');

const headersSchema = {
  headers: Joi.object()
    .keys({ authorization: Joi.string().required() })
    .unknown(true),
};
const maxIngredients = Object.values(burgerIngredientLimits).reduce((a, v) => a + v);

module.exports.headersValidation = celebrate(headersSchema);

module.exports.validateAuthRequest = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.getIngredientsByCategoryValidation = celebrate({
  ...headersSchema,
  params: Joi.object().keys({
    category: Joi.string().valid(...ingredientCategories),
  }),
});

module.exports.newIngredientValidation = celebrate({
  ...headersSchema,
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(100),
    category: Joi.string().valid(...ingredientCategories).required(),
    quantity: Joi.number().integer().positive().required(),
    price: Joi.number().positive().required(),
  }),
});

module.exports.setIngredientsQuantityValidation = celebrate({
  ...headersSchema,
  params: Joi.object().keys({
    ingredientId: Joi.string().required().hex().length(24),
  }),
  body: Joi.object().keys({
    quantity: Joi.number().integer().positive().required(),
  }),
});

module.exports.removeIngredientValidation = celebrate({
  ...headersSchema,
  params: Joi.object().keys({
    ingredientId: Joi.string().required().hex().length(24),
  }),
});

module.exports.saveBurgerValidation = celebrate({
  ...headersSchema,
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(100),
    ingredients: Joi.array().items(Joi.string().required().hex().length(24)).max(maxIngredients),
    price: Joi.number().positive().required(),
    owner: Joi.string().required().hex().length(24),
  }),
});

module.exports.deleteBurgerValidation = celebrate({
  ...headersSchema,
  params: Joi.object().keys({
    burgerId: Joi.string().required().hex().length(24),
  }),
});

module.exports.makeOrderValidation = celebrate({
  ...headersSchema,
  body: Joi.object().keys({
    list: Joi.array().items(Joi.string().required().hex().length(24)),
    price: Joi.number().positive().required(),
    owner: Joi.string().required().hex().length(24),
  }),
});
