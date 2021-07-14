const Burger = require('../models/burger');
const Ingredient = require('../models/ingredient');
const BadRequestError = require('../erorrs/bad-request-error');

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

class OrderService {
  static calculatePrice(list) {
    return Burger.find({ _id: { $in: list } })
      .then((foundBurgers) => {
        const orderList = list.map((item) => foundBurgers.find((fb) => String(fb._id) === item));
        orderList.forEach((item) => {
          if (typeof item === 'undefined') throw new BadRequestError('some burgers not found');
        });
        return orderList.reduce((sum, current) => sum + current.price, 0);
      });
  }

  static updateStock(order) {
    getIngredients(order)
      .then((ingredients) => {
        const ingredientsUsed = [...new Set(ingredients)].map((ingredient) => {
          let amount = 0;
          for (let i = 0; i < ingredients.length; i += 1) {
            if (ingredients[i]._id === ingredient._id) amount += 1;
          }
          return { id: ingredient._id, quantity: ingredient.quantity, amount };
        });
        const promises = [];
        ingredientsUsed.forEach((ingredient) => {
          const quantity = ingredient.quantity - ingredient.amount;
          if (quantity >= 0) {
            promises.push(Ingredient.findByIdAndUpdate(ingredient.id, { quantity }));
          } else {
            throw new BadRequestError('not enough ingredients in stock');
          }
        });
        Promise.all(promises);
      });
  }
}

module.exports = OrderService;
