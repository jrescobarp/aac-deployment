const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose")


const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {
        type: String,
        required: [true, "first name is required and is of type string"],
    },
    last_name: {
        type: String,
        required: [true, "last name is required and is of type string"],
    },
    email: {
        type: String,
        required: [true, "email is required and is of type string"],
        unique: true
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'Comment'
    },
    images: {
        type: [Schema.Types.ObjectId],
        ref: 'Image'
    },
    recipes: {
        type: [Schema.Types.ObjectId],
        ref: 'Recipe'
    },
    recipe_history: {
        type: [Schema.Types.ObjectId],
        ref: 'Recipe'
    },
    tssci: {
        type: Boolean,
        default: false
    }
});

UserSchema.plugin(passportLocalMongoose);
 

module.exports = mongoose.model("User", UserSchema);