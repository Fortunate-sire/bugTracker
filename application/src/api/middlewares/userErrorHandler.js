const userSignUpErrors = (error, req, res, next) => {
    
    console.log('now this is just so so so sad')
    if (error && error.code === 11000) {
        const errorMessage = 'A user with this email already exists. Please use a different email address.';
        req.flash('error', errorMessage);
        return res.redirect('/signup');
    }

    next();
};

module.exports = { userSignUpErrors };
