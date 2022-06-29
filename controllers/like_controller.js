const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');

module.exports.likefn = async (req, res) => {
    try {

        let likedObject;
        let deleted = false;
        // console.log('req.query.type', req.query.type);
        // console.log('req.query', req.query);

        if (req.query.type === 'Post') {
            likedObject = await Post.findById(req.query.id).populate('likes');
        }
        else {
            likedObject = await Comment.findById(req.query.id).populate('likes');
        }

        console.log('likedObject', likedObject);

        // check if already like exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user.id
        })

        //if already like exists
        let act;
        if (existingLike) {
            // console.log('existingLike', existingLike);
            likedObject.likes.pull(existingLike._id);
            likedObject.save();
            existingLike.remove();
            deleted = true;
            act='You disliked it';
            // console.log(act);
        }

        // else create a new like
        if (!existingLike) {
            let newLike = await Like.create({
                likeable: req.query.id,
                onModel: req.query.type,
                user: req.user.id
            });
            // console.log('newLike', newLike);
            likedObject.likes.push(newLike);
            likedObject.save();
            act='You liked it';
            // console.log(act);
        }

        // return res.json(200, {
        //     message: 'Successfully',
        //     data: {
        //         deleted,
        //         act
        //     }
        // });

        return res.redirect('back');
    } catch (error) {
        console.log('error', error);
        return res.json(500, {
            message: 'Internal server error'
        });
    }
}