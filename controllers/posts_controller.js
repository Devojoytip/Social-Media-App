const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

// module.exports.createPost = (req, res) => {
//     Post.create({
//         content: req.body.content,
//         user: req.user._id
//     }, (err, post) => {
//         if (err) {
//             console.log('Error in creating a post');
//             return;
//         }
//         else return res.redirect('back');
//     })
// }

module.exports.createPost = async (req, res) => {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        //view data
        // check if req is ajax req
        // if (req.xhr) {
        //     console.log('req is xhr');
        //     return res.status(200).json({
        //         data:{
        //             post:post
        //         },
        //         message:'Post created !'
        //     })
        // }

        return res.redirect('back');
    } catch (error) {
        console.log('Error is', error);
        return;
    }
}

// module.exports.deletePost = (req, res) => {
//     console.log(req.params.id);
//     Post.findById(req.params.id, (err, post) => {
//         // .id used for converting obj id to string id
//         if (err) {
//             console.log('Error in finding post');
//         }
//         console.log(post.user);
//         console.log('Datatype of post.user',typeof(post.user)); //object
//         console.log(req.user.id);
//         console.log('Datatype of req.user.id',typeof(req.user.id));//string

//         if (post.user.toString() === req.user.id) {
//             post.remove();
//             console.log('Post deleted');

//             Comment.deleteMany({ post: req.params.id }, (err) => {
//                 if (err) {
//                     console.log('Error in deleting comments');
//                     return res.redirect('back');
//                 }
//                 else{
//                     console.log('Deleted the post and all its comments if existed');
//                     // console.log('Deleted all comments');
//                     return res.redirect('back');
//                 }
//             })
//         }

//         else {
//             return res.redirect('back');
//         }
//     })
// }

module.exports.deletePost = async (req, res) => {
    try {
        // console.log(req.params.id);
        let post = await Post.findById(req.params.id);
        // console.log(post.user);
        // console.log('Datatype of post.user', typeof (post.user)); //object
        // console.log(req.user.id);
        // console.log('Datatype of req.user.id', typeof (req.user.id));//string

        if (post.user.toString() === req.user.id) {
            post.remove();
            console.log('Post deleted');

            let CommentsArr = await Comment.find({});
            console.log('CommentsArr', CommentsArr);

            // 1st way
            for (let i =0;i<CommentsArr.length;i++) {
                // console.log('CommentsArr[',i,']',CommentsArr[i]);
                // console.log('i.post',CommentsArr[i].post);
                if (CommentsArr[i].post.toString() === req.params.id) {
                    await Like.deleteMany({ likeable: CommentsArr[i]._id });
                }
            }

            // 2nd way but not working
            // await Like.deleteMany({ _id: {$in: post.comments } });

            //delete all likes of the post
            // await Like.deleteMany({ likeable: req.params.id }); 
            // or
            await Like.deleteMany({ likeable: post });

            await Comment.deleteMany({ post: req.params.id });
            console.log('Deleted the post and all its associated comments & likes');
            // console.log('Deleted all comments');
            return res.redirect('back');
        }
    } catch (error) {
        console.log('Error is', error);
        return;
    }

}