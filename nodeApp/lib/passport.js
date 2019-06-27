/* login authentification inspired from : https://www.youtube.com/watch?v=6FOq4cUdH8k
https://github.com/bradtraversy/node_passport_login */

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

module.exports = function (passport, mariaUserAuth) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' },
            (email, password, done) => {
                // Match email
                mariaUserAuth.findOne(email)
                    .then(user => {
                        if (!user) {
                            return done(null, false, { message: 'That email is not registered' });
                        }

                        // Match password
                        bcrypt.compare(password, user.pw, (err, isMatch) => {
                            if (err) throw err;
                            if (isMatch) {
                                return done(null, user);
                            } else {
                                return done(null, false, { message: 'That password is incorrect' });
                            }
                        });
                    })
                    .catch(err => console.log(err));
            }));

    passport.serializeUser(function (user, done) {
        done(null, user.email);
    });

    passport.deserializeUser(function (email, done) {
        mariaUserAuth.findById(email, function (err, user) {
            done(err, user);
        });
    });
};//