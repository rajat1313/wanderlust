const User = require("../Models/user");

module.exports.renderSignUpForm = (req, res) => {
    res.render("user/signup.ejs");
};


module.exports.SignUp = async (req, res) => {
    let { username, password, email } = req.body;
    const newUser = new User({ email, username });
    const registerdUser = await User.register(newUser, password);
    console.log(registerdUser);
    
    req.login(registerdUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "user was registerd");
        res.redirect("/listings");
    })

};


module.exports.login = (req, res) => {
    res.render("user/login.ejs");
};


module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out now!");
        res.redirect("/listings");

    });

};