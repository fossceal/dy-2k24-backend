const User = require('../models/user_model');
const sendToken = require('../utils/jwtToken');
const { firebaseAdmin } = require('../configs/firebase');

exports.createUser = async (req, res) => {
    try {
        const { uid, name, token } = req.body;

        if (process.env.ENVIRONMENT === 'PRODUCTION') {
            const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

            if (decodedToken.uid !== uid) {
                return res.status(400).json({ success: false, message: 'Invalid OAuth token' });
            }
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
        const { uid, token, name } = req.body;

        if (process.env.ENVIRONMENT === 'PRODUCTION') {
            const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

            if (decodedToken.uid !== uid) {
                return res.status(400).json({ success: false, message: 'Invalid OAuth token' });
            }
        }

        var user = await User.findOne({ uid: uid });

        if (!user) {
            user = await User.create({
                uid: uid,
                name: name
            });

            sendToken(user, 200, res);
            return;
        }

        sendToken(user, 200, res);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            sendToken({ uid: 'admin', name: 'admin', role: "admin" }, 200, res);
        } else {
            res.status(401).json({ success: false, message: 'Unauthorized' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

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

exports.completeProfile = async (req, res) => {
    try {
        // const { email, phone, college, year } = req.body;

        const user = await User.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true });

        if (user.email !== null && user.phone !== null && user.college !== null && user.year !== null) {
            user.isCompletedProfile = true;
            await user.save();
        }

        res.status(200).json({ success: true, message: 'Profile updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

exports.isCompleteProfile = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({ success: true, isCompleteProfile: user.isCompletedProfile });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}