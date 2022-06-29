const Post = require('../../../models/post');
const Comment = require('../../../models/comment');


module.exports.index = async (req, res) => {

    try {
        let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            });
        return res.json(200, {
            message: 'List of posts',
            posts: posts
        })
    } catch (error) {
        console.log('Error in fetching posts :', error);
        return;
    }
}

module.exports.deletePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        console.log('req.params.id',req.params.id);
        console.log('post',post);

        if (post.user.toString() === req.user.id) {
            post.remove();
            await Comment.deleteMany({ post: req.params.id })
            return res.json(200, {
                message: "Post deleted",
                post
            });
        }

        else{
            return res.json(401, {
                message: "You can't delete the post"
            });
        }

    } catch (error) {
        console.log('error', error);
        return res.json(500, {
            message: "Error"
        });

    }

}