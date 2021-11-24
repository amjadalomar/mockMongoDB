const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    title: String,
    servings: Number,
    cookingTime: Number,
    author: String,
    image: String,
    ingredients: String,
    instructions: String
});

module.exports = mongoose.model('Recipe', RecipeSchema);