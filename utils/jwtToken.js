// create token and saving that in cookies
const jwt = require("jsonwebtoken");

const sendToken = (user, statusCode, res) => {
    const token = jwt.sign({ id: user.uid, role: user.role }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES * 60 * 60 * 24 * 1000,
    });

    // Options for cookies
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: false,
        withCredentials: true,
        secure: false,
    };

    res.cookie('token', token, options);
    res.status(statusCode).send({ success: true, user, token });
}

module.exports = sendToken;