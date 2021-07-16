const Burger = require('../models/burger');
const Ingredient = require('../models/ingredient');
const Order = require('../models/order');
const BadRequestError = require('../erorrs/bad-request-error');
const { concatenateErrorMessages: concatErrs } = require('../utils');

class OrderService {
  constructor(res, next) {
    this.res = res;
    this.next = next;
  }

  findUserOrders(owner) {
    return Order.find({ owner })
      .populate('list')
      .then((order) => this.res.json(order))
      .catch(this.next);
  }

  getIngredients(list) {
    return Burger.find({ _id: { $in: list } })
      .populate('ingredients')
      .then((foundBurgers) => {
        let ingredients = [];
        foundBurgers.forEach((fb) => {
          ingredients = [...ingredients, ...fb.ingredients];
        });
        return ingredients;
      })
      .catch((err) => this.next(
        err.kind === 'ObjectId' ? new BadRequestError('invalid ingredient(s) id') : err,
      ));
  }

  calculatePrice(list) {
    return Burger.find({ _id: { $in: list } })
      .then((foundBurgers) => {
        const orderList = list.map((item) => foundBurgers.find((fb) => String(fb._id) === item));
        orderList.forEach((item) => {
          if (typeof item === 'undefined') throw new BadRequestError('some burgers not found');
        });
        return orderList.reduce((sum, current) => sum + current.price, 0);
      })
      .catch((err) => this.next(
        err.kind === 'ObjectId' ? new BadRequestError('invalid ingredient(s) id') : err,
      ));
  }

  updateStock(ingredients) {
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
    Promise.all(promises)
      .catch(this.next);
  }

  makeOrder(list, price, owner) {
    Order.create({ list, price, owner })
      .then((order) => this.res.json(order))
      .catch((err) => this.next(
        err.name === 'ValidationError' ? new BadRequestError(concatErrs(err)) : err,
      ));
  }
}

module.exports = OrderService;
