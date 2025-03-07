const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    name: {
        type: String,
        required: [true, "name is required and is of type string"],
    },
    description: {
        type: String,
    },
    portions: {
        type: String,
    },
    steps: {
        type: [String],
        required: [true, "steps is required and is of type [string]"],
    },
    verbs: {
        type: [String],
    },
    ingredients: {
        type: [String],
        required: [true, "ingredients is required and is of type [string]"],
    },
    type: {
        type: [String],
        required: [true, "type is required and is of type [string]"],
    },
    connected_recipes: {
        type: [Schema.Types.ObjectId],
        ref: 'Recipe'
    },
    images: {
        type: [Schema.Types.ObjectId],
        ref: 'Image'
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'Comment'
    },
    featuredMealCount:{
        type: Number
    },
    book:{
        type:[String],
        required:[true, "Book is required and is of type [String]"]
    }
});
 

module.exports = mongoose.model("Recipe", RecipeSchema);