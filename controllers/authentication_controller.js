const User = require('../models/user_model');
const sendToken = require('../utils/jwtToken');
const firebaseAdmin = require('../configs/firebase');

exports.createUser = async (req, res) => {
    try {
        const { uid, name, token } = req.body;

        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

        if (decodedToken.uid !== uid) {
            return res.status(400).json({ success: false, message: 'Invalid OAuth token' });
        }

        const user = await User.create({
            uid: uid,
            name: name
        });

        sendToken(user, 201, res);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { uid, token } = req.body;

        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

        if (decodedToken.uid !== uid) {
            return res.status(400).json({ success: false, message: 'Invalid OAuth token' });
        }

        const user = await User.findOne({ uid: uid });

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

exports.getUser = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({ success: true, user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};