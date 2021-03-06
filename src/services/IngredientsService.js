const Ingredient = require('../models/ingredient');
const BadRequestError = require('../erorrs/bad-request-error');
const ConflictError = require('../erorrs/conflict-error');
const { concatenateErrorMessages: concatErrs } = require('../utils');

class IngredientsService {
  constructor(res, next) {
    this.res = res;
    this.next = next;
  }

  getAll(params) {
    const { category } = params;

    Ingredient.find(category && params)
      .then((ingredients) => this.res.json(ingredients))
      .catch(this.next);
  }

  create(name, category, quantity, price) {
    Ingredient.create({
      name,
      category,
      quantity,
      price,
    })
      .then((ingredient) => this.res.json(ingredient))
      .catch((err) => {
        if (err.code === 11000) {
          this.next(new ConflictError('ingredient already exists'));
        } else if (err.name === 'ValidationError') {
          this.next(new BadRequestError(concatErrs(err)));
        } else {
          this.next(err);
        }
      });
  }

  remove(ingredientId) {
    Ingredient.findByIdAndRemove(ingredientId)
      .then((removedIngredient) => {
        if (removedIngredient) this.res.json(removedIngredient);
        else throw new BadRequestError('ingredient not found');
      })
      .catch((err) => this.next(err.kind === 'ObjectId' ? new BadRequestError('invalid ingredient id') : err));
  }

  setQuantity(ingredientId, quantity) {
    Ingredient.findByIdAndUpdate(ingredientId, { quantity }, { new: true })
      .then((ingredient) => this.res.json(ingredient))
      .catch((err) => this.next(
        err.name === 'ValidationError' ? new BadRequestError(concatErrs(err)) : err,
      ));
  }
}

module.exports = IngredientsService;
