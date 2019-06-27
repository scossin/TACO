import Express = require('express');

import {MyReq} from '../routes/Request';
import {MyRes} from '../routes/Response';

module.exports = {
    ensureAuthenticated: function(req: MyReq, res: MyRes, next: Express.NextFunction){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg','Please log in to view this resource');
        res.redirect('/users/login');
    },

    /**
     * Used for development
     */
    ensureAuthenticated2: function(req: MyReq, res: MyRes, next:Express.NextFunction){
        req.user = {
            username: "sebastien.cossin@chu-bordeaux.fr",
            email: "sebastien.cossin@chu-bordeaux.fr",
            pw: "secret"
        };
        return next();
    }
}