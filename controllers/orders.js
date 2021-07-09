const Order = require('../models/order');
const Burger = require('../models/burger');
const Ingredient = require('../models/ingredient');
const BadRequestError = require('../erorrs/bad-request-error');
const { concatenateErrorMessages } = require('../utils');

module.exports.getOrders = (req, res, next) => {
  const owner = req.user._id;

  Order.find({ owner })
    .populate('list')
    .then((order) => res.json(order))
    .catch(next);
};

module.exports.makeOrder = (req, res, next) => {
  const { list } = req.body;
  const owner = req.user._id;

  function calculateOrderPrice() {
    return Burger.find({ _id: { $in: list } }).then((foundBurgers) => {
      const orderList = list.map((item) => foundBurgers.find((fb) => String(fb._id) === item));
      orderList.forEach((item) => {
        if (typeof item === 'undefined') throw new BadRequestError('some burgers not found');
      });
      return orderList.reduce((sum, current) => sum + current.price, 0);
    });
  }

  function getIngredients(order) {
    return Burger.find({ _id: { $in: order.list } })
      .populate('ingredients')
      .then((foundBurgers) => {
        let ingredients = [];
        foundBurgers.forEach((fb) => {
          ingredients = [...ingredients, ...fb.ingredients];
        });
        return ingredients;
      });
  }

  function updateIngredientsQuantity(order) {
    getIngredients(order)
      .then((ingredients) => {
        const ingredientsUsed = [...new Set(ingredients)].map((ingredient) => {
          let count = 0;
          for (let i = 0; i < ingredients.length; i += 1) {
            if (ingredients[i]._id === ingredient._id) count += 1;
          }
          return { id: ingredient._id, quantity: ingredient.quantity, count };
        });
        const promises = [];
        ingredientsUsed.forEach((ingredient) => {
          promises.push(
            Ingredient.findByIdAndUpdate(
              ingredient.id, { quantity: ingredient.quantity - ingredient.count }, { new: true },
            ),
          );
        });
        Promise.all(promises);
      });
  }

  calculateOrderPrice()
    .then((price) => {
      Order.create({ list, price, owner })
        .then((order) => {
          updateIngredientsQuantity(order);
          return res.json(order);
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequestError(concatenateErrorMessages(err)));
      else if (err.kind === 'ObjectId') next(new BadRequestError('invalid burger ids'));
      else next(err);
    });
};
