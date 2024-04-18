const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

exports.sendMail = async (to, subject, text, html) => {
    try {
        transporter.sendMail({
            from: "Daksha Yanthra Team",
            to: to,
            subject: subject,
            text: text,
            html: html,
        });

        return;
    } catch (err) {
        console.log(err);
        throw new Error("Mail not send due to: " + err);
    }
}