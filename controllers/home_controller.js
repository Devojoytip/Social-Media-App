const Post = require('../models/post');
const User = require('../models/user');
const Friendship = require('../models/friendship');
// import { Notyf } from 'notyf';
// const Notyf = require('Notyf');

module.exports.home_fn = async (req, res) => {
    // return res.end('<h1>Home Page</h1>');

    // without populating
    // Post.find({},(err,wholePostList)=>{
    //     if (err) {
    //         console.log("Error in fetching posts from DB :", err);
    //         return;
    //     }
    //     console.log('Posts are',wholePostList);
    //     return res.render('home', {
    //         title:'Home Page',
    //         user:req.user,
    //         post_list: wholePostList
    //     })
    // });

    // Async
    
    // populating user of each post
    // Post.find({}).populate('user')
    // .populate({
    //     path:'comments', //comment arr of post schema
    //     populate:{
    //         path:'user'
    //     }
    // })
    // .exec((err,wholePostList)=>{
    //     if (err) {
    //         console.log("Error in fetching posts from DB :", err);
    //         return;
    //     }
    //     // console.log('Posts are',wholePostList);

    //     User.find({},(err,wholeUsersList)=>{
    //         return res.render('home', {
    //             title:'Home Page',
    //             user:req.user,
    //             post_list: wholePostList,
    //             all_users:wholeUsersList
    //         })
    //     })
    // });

    // Converting to Async Await
    try {
        let wholePostList = await Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });

        let wholeUsersList= await User.find({});  

        let friendships_list=await Friendship.find({})
        .populate({
            path:'from_user'
        })
        .populate({
            path:'to_user'
        });

        // console.log('friendships_list',friendships_list);

        return res.render('home', {
            title: 'Home Page',
            user: req.user,
            post_list: wholePostList,
            all_users: wholeUsersList,
            friendships_list
            // notyf
        })
                    
    } catch (error) {
        console.log('Error is',error);
        return;
    }


    // console.log(req.cookies);
    // // res.cookie('Id','20BCE2355');

    // return res.render('home',{
    //     title:'Home Page',
    //     user:req.user
    // });
}