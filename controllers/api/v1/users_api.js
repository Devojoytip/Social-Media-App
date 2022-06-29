const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const env=require('../../../config/environment');

module.exports.createSession = async (req, res) => {

    try {
        let user = await User.findOne({ email: req.body.email });

        if (!user || user.password !== req.body.password) {
            // return res.json(422, {
            //     message: 'Invalid username or password'
            // })
            return res.status(422).json({
                message: 'Invalid username or password'
            })
        }

        else {
            // return res.json(200, {
            //     message: 'Sign in successfully ',
            //     name_of_user:user.username,
            //     data: {
            //         token: jwt.sign( user.toJSON(), 'my secret key', { expiresIn: '100000' })
            //         // user.toJSON() IS ENCRYPTED
            //     }
            // })
            return res.status(200).json({
                message: 'Sign in successfully ',
                name_of_user:user.username,
                data: {
                    token: jwt.sign( user.toJSON(), env.jwt_secret, { expiresIn: '100000' })
                    // user.toJSON() IS ENCRYPTED
                }
            })
        }
    } catch (error) {
        console.log('*****ERROR*******',error);
        return res.json(500,{
            message:'Internal server error'
        });
    }


}