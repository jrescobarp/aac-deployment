const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    upvotes:{
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    replies:{
        type: [Schema.Types.ObjectId],
        ref: 'Comment'
    },
    date_created:{
        type: Number,
        required: true
    }
});



module.exports = mongoose.model("Comment", CommentSchema);