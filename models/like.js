const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId
    },
    // on which like is hit (it can be post or comment liked by some user)
    // and used for defining id of the liked obj
    likeable: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'onModel' // path to field which defines what type of object like is hit
    },
    // used for defining type of the liked obj
    onModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment'] // as likeable can be Post or Comment
    }
}, { timestamps: true });

const Like = new mongoose.model('Like', likeSchema);

module.exports = Like;