const Recipe = require("../models/recipe");
const asyncHandler = require("express-async-handler");


exports.get_all_recipes = asyncHandler(async(req, res, next) => {
    const allRecipeInstances = await Recipe.find().populate({
        path: 'images',
        populate: { 
            path:'comments', 
            populate: 'replies'
        }
    }).exec();
    res.status(200).send(allRecipeInstances);
});

exports.get_one_recipes = asyncHandler(async(req, res, next) => {
    Recipe.findById(req.params.id)
        .populate({
            path: 'comments',
            populate: { path:'replies' }
        })
        .populate({
            path: 'images',
            populate: { 
                path:'comments', 
                populate: 'replies'
            }
        })
        .populate({
            path: 'connected_recipes',
        })
        .then((recipe) =>{
        res.status(200).send(recipe);
    });
});

exports.create_new_recipe = asyncHandler(async(req, res, next) => {
    res.send("Not Currently implemented:create_new_recipe");
});

exports.edit_recipe = asyncHandler(async(req, res, next) => {
    res.send("Not Currently implemented:edit_recipe");
});

exports.delete_recipe = asyncHandler(async(req, res, next) => {
    res.send("Not Currently implemented:delete_recipe");
});