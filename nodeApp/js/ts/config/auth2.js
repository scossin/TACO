"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in to view this resource');
        res.redirect('/users/login');
    },
    /**
     * Used for development
     */
    ensureAuthenticated2: function (req, res, next) {
        req.user = {
            username: "sebastien.cossin@chu-bordeaux.fr",
            email: "sebastien.cossin@chu-bordeaux.fr",
            pw: "secret"
        };
        return next();
    }
};
