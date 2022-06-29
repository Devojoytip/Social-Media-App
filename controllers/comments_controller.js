const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');
const commentsMailer = require('../controllers/mailers/comments_mailer');

// module.exports.create_comment = (req, res) => {
//     // return res.end('<h1>Comment Section</h1>');

//     Post.findById(req.body.post, (err, post) => {
//         if (err) {
//             console.log('Error');
//             return;
//         }
//         if (post) {
//             Comment.create({
//                 content: req.body.content,
//                 user: req.user,
//                 post: req.body.post
//             }, (err, comment) => {
//                 if (err) {
//                     console.log('Error');
//                     return;
//                 }
//                 else {
//                     post.comments.push(comment);
//                     post.save();// to save the update in db
//                     return res.redirect('/');
//                 }
//             })
//         }
//     })

// };


module.exports.create_comment = async (req, res) => {

    try {
        let post = await Post.findById(req.body.post);

        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                user: req.user,
                post: req.body.post
            });
            post.comments.push(comment);
            post.save();// to save the update in db

            comment=await comment.populate('user','username email');
            // console.log('comment',comment)
            commentsMailer.newComment(comment);
            return res.redirect('/');
        }

    } catch (error) {
        console.log('Error is', error);
        return;
    }

};

// module.exports.delete_comment = (req, res) => {
//     Comment.findById(req.params.id, (err, comm) => {
//         console.log(comm.user);
//         console.log('Datatype of comm.user', typeof (comm.user)); // object
//         console.log(req.user.id);
//         console.log('Datatype of req.user.id', typeof (req.user.id)); // string
//         console.log(comm.user.toString());

//         // this if doesn't permit you to delete comments of other users made on your posts

//         // if (comm.user.toString() === req.user.id) {
//         //     let postId = comm.post;
//         //     comm.remove();

//         //     Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } }, (err, post) => {
//         //         return res.redirect('back');
//         //     })
//         // }

//         // else {
//         //     return res.redirect('back');
//         // }

//         let postId = comm.post;
//         comm.remove();

//         Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } }, (err, post) => {
//             return res.redirect('back');
//         })

//     });
// };

module.exports.delete_comment = async (req, res) => {
    try {
        let comm = await Comment.findById(req.params.id);
        console.log(comm.user);
        console.log('Datatype of comm.user', typeof (comm.user)); // object
        console.log(req.user.id);
        console.log('Datatype of req.user.id', typeof (req.user.id)); // string
        console.log(comm.user.toString());
        let postId = comm.post;
        comm.remove();

        await Like.deleteMany({likeable:comm.id}); //delete all likes of the comment

        let post = await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
        return res.redirect('back');


    } catch (error) {
        console.log('Error is', error);
        return;
    }
};