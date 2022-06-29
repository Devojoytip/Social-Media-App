const User = require('../models/user');
const Friendship = require('../models/friendship');

module.exports.friendship_fn = async (req, res) => {
    try {
        const toUserId = req.query.to;
        const fromUserId = req.query.from;
        
        let toUser = await User.findById(toUserId);
        let fromUser = await User.findById(fromUserId);
        
        // console.log('toUser',toUser);
        // console.log('fromUser',fromUser);

        let fr= await Friendship.create({
            from_user:fromUser,
            to_user:toUser
        });

        toUser.friendship.push(fr);
        toUser.save();
        fromUser.friendship.push(fr);
        fromUser.save();

        return res.redirect('/'); // redirects to http://localhost:8000/

    } catch (error) {
        console.log('error', error);
        return res.json(500, {
            message: 'Internal server error'
        })
    }
}