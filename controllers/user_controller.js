const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile_fn = (req, res) => {
    console.log('Profile is viewed');
    console.log(req.user)
    res.render('profile', {
        title: 'Profile Page',
        org_user: req.user,
        logged_user: req.user
    });
}

module.exports.profile_fn2 = (req, res) => {
    User.findById(req.params.id, (err, profile_user) => {
        return res.render('profile', {
            title: 'User Profile',
            org_user: profile_user,
            logged_user: req.user
        })
    })
}

module.exports.update_profile = async (req, res) => {
    //async

    // if (req.user.id === req.params.id && req.user.password === req.body.password) {
    //     User.findByIdAndUpdate(req.params.id, {
    //         username: req.body.updated_username,
    //         email: req.body.updated_email
    //     }, (err, user) => {
    //         console.log('Profile successfully Updated !!!');
    //         return res.redirect('/');
    //     });
    // }
    // else {
    //     return res.status(401).send('Unauthorized');
    // }

    // async await
    // console.log(req.user);
    // console.log('req.user.id : ', req.user.id);
    // console.log('req.params.id :', req.params.id);
    // console.log('req.user.password :', req.user.password);
    // console.log('req.body.password :', req.body.password);
    // console.log(req.body)

    if (req.user.id === req.params.id) {
        // console.log(req.body)
        try {
            let updatedUser = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, (err) => {
                if (err) {
                    console.log('*******Maltar Error:', err);
                }
                else {
                    // console.log(req.body)
                    if (req.user.password === req.body.password) {
                        if (req.body.updated_username.length > 0) {
                            updatedUser.username = req.body.updated_username;
                        }

                        if (req.body.updated_email.length > 0) {
                            updatedUser.email = req.body.updated_email;
                        }

                        // console.log(req.body);

                        // if there is some uploaded file
                        if (req.file) {
                            console.log('req.file is', req.file);

                            const ext = req.file.mimetype.split("/")[1];
                            console.log('ext is', ext);

                            if (ext === 'jpeg' || ext === 'png') {

                                //if already has an avatar
                                if (updatedUser.avatar) {
                                    // console.log(updatedUser.avatar);
                                    console.log('path is', path.join(__dirname, '..', updatedUser.avatar));
                                    const oldAvatar = updatedUser.avatar;
                                    fs.access(path.join(__dirname, '..', updatedUser.avatar), (err) => {
                                        if (!err) {
                                            // means the file(old avatar) exists
                                            console.log('path is', path.join(__dirname, '..', updatedUser.avatar));
                                            console.log('file exists');

                                            // deleting old avatar file
                                            fs.unlinkSync(path.join(__dirname, '..', oldAvatar));
                                            return;
                                        }
                                        else {
                                            console.log('file does not exist');
                                            return;
                                        }
                                    });
                                    //this is saving the path of the uploaded file into avatar field in the user
                                }
                                updatedUser.avatar = User.avatarPath + '/' + req.file.filename;
                                console.log('user.avatar is : ', updatedUser.avatar);
                                updatedUser.save();
                                return res.redirect('/');
                            }

                            // not in jpeg/png format
                            else {
                                // ensuring the files of wrong format are deleted
                                updatedUser.avatar = User.avatarPath + '/' + req.file.filename;
                                fs.unlinkSync(path.join(__dirname, '..', updatedUser.avatar));

                                return res.redirect('/');
                            }
                        }
                    }

                    // Wrong password
                    else {
                        console.log("Wrong password");
                        return res.redirect('/');
                    }
                }
            });
        } catch (error) {
            return res.redirect('back');
        }
    }

    else {
        return res.status(401).send('Unauthorized');
    }
}

module.exports.users_home_fn = (req, res) => {
    // return res.end('<h1>User Home Page</h1>');
    return res.render('home', {
        title: 'Users Home Page',
        user: req.user
    });
}

module.exports.users_signup = (req, res) => {

    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('signup', {
        title: 'New User - Sign Up'
    });
}

module.exports.users_login = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('login', {
        title: 'Login Page',
    });
}

module.exports.create = (req, res) => 
{
    if (req.body.password !== req.body.confirm_pw) {
        console.log('Password & Confirm Password does not match');
        // return res.redirect('back');
        req.flash('error', 'Password & Confirm Password does not match');
        return res.render('signup', {
            title: 'Password & Confirm Password does not match'
        });
    }

    // search for a user with same email
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            console.log('Error in finding user in signing up', err);
            return;
        }

        else {
            if (!user) {
                User.create(req.body, (err, user) => {
                    if (err) {
                        console.log('Error in creating user while signing up');
                        return;
                    }
                    req.flash('success', 'You have created your account');
                    return res.redirect('/users/login');
                })
            }
            else {
                console.log('E-mail already registered !!!');
                // return res.redirect('back');
                req.flash('info', 'E-mail already registered !!!');
                return res.render('signup', {
                    title: 'E-mail already registered !!!'
                });
            }
        }
    });

    // User.uploadedAvatar(req, res, (err) => 
    // {
    //     if (err) {
    //         console.log('*******Maltar Error:', err);
    //     }

    //     User.findOne({ email: req.body.email }, (err, user) => 
    //     {
    //         if (err) 
    //         {
    //             console.log('Error in finding user in signing up', err);
    //             return;
    //         }
    //         else 
    //         {
    //             if (!user) 
    //             {
    //                 User.create(req.body, (err, user) => {
    //                     if (err) {
    //                         console.log('Error in creating user while signing up');
    //                         return;
    //                     }
    //                     console.log('req.file.filename',req.file.filename);
    //                     user.avatar = User.avatarPath + '/' + req.file.filename;
    //                     console.log('user.avatar',user.avatar)
    //                     return res.redirect('/users/login');
    //                 })
    //             }
    //             else 
    //             {
    //                 console.log('E-mail already registered !!!');
    //                 // return res.redirect('back');
    //                 return res.render('signup', {
    //                     title: 'E-mail already registered !!!'
    //                 });
    //             }
    //         }


    //     });

    // });
    // let found = false;
    // for (let ele in User) {
    //     if (ele.email === req.body.email) {
    //         found = true;
    //         return res.redirect('back');
    //     }
    // }
    // if (!found) {
    //     User.create(req.body, (err, user) => {
    //         if (err) {
    //             console.log('Error in creating user while signing up');
    //             return;
    //         }
    //         return res.redirect('/users/login');
    //     })
    // }
}


module.exports.createSession = (req, res) => {
            //flash messages
            req.flash('success','Logged In Successfully');
            return res.redirect('/');
}

module.exports.destroySession = (req, res, next) => {
            //flash messages
            // req.flash('success','You have logged out');

            // req.logout((err) => {
            //     if (err) {
            //         return next(err);
            //     }
            //     else return res.redirect('/');
            // });

            // req.logout();
            req.logout(function (err) {
                if (err) { return next(err); }
                req.flash('custom', 'You have logged out');
                res.redirect('/');
            });
            // return res.redirect('/');

        }
