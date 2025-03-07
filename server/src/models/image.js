const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imgData = new Schema({
    url: String,
    filename: String
});

const ImageSchema = new Schema({
        user_id: {
            type:Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        recipe_id: {
            type:Schema.Types.ObjectId,
            ref: 'Recipe',
            required: true
        },
        username: {
            type: String,
            required: true
        },
        imgDataArr: {
            type: [imgData],
            required: true
        },
        description: {
            type: String,
            required: true
        },
        upvotes: {
            type: [Schema.Types.ObjectId],
            ref: 'User'
        },
        // report: string,
        comments: {
            type: [Schema.Types.ObjectId],
            ref: 'Comment'
        },
});


module.exports = mongoose.model("Image", ImageSchema);