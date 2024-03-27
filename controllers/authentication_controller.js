const User = require('../models/user_model');
const sendToken = require('../utils/jwtToken');

exports.createUser = async (req, res) => {
    try {
        const { uid, name } = req.body;
        const user = await User.create({
            _id: uid,
            name: name
        });

        sendToken(user, 201, res);
        res.status(201).json({ success: true, data: adminData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { uid } = req.body;
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        sendToken(user, 200, res);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

exports.logoutUser = async (req, res) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: false,
            withCredentials: true,
            sameSite: 'none',
            secure: true,
        });
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

