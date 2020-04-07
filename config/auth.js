module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        } 

        req.flash('erro_msg', 'Please log in');
        res.redirect('/users/login');
    }
}