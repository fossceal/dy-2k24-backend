const Proshow = require("../models/proshow_model");
const { sendMail } = require("../utils/sendMail");
const qrcode = require('qrcode');
const { nanoid } = require("nanoid");

//used only once
exports.sendProshowTickets = async () => {

    try {

        const names = [
            "MUHAMMED THOUFEEK",
            "SIDDARTH S PARTHAN",
            "Anandhu.H.Kurup",
            "Mehran Sha"
        ];
        const emails = [
            "muhammadthoufeek2003@gmail.com",
            "muhammadthoufeek2003@gmail.com",
            "bkurupharikumar@gmail.com",
            "mehranmehransha@gmail.com"
        ];
        const phones = [
            "7736450287",
            "9496642877",
            "9947148767",
            "812958304"
        ];
        const colleges = [
            "DON BOSCO COLLEGE KOTTIYAM",
            "MANGALAM COLLEGE OF ENGINEERING",
            "College of Engineering, Attingal",
            "UKFCET"
        ];

        for (var i = 0; i < emails.length; i++) {
            const name = names[i];
            const email = emails[i];
            const phone = phones[i];
            const college = colleges[i];

            const id = nanoid(6);

            await Proshow.create({
                email: email,
                phone: phone,
                name: name,
                college: college,
                uniqueString: id,
            });

            const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Event Ticket</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f5f5f5;
                        color: #333333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 5px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                        position:relative;
                    }
                    h1 {
                        color: #0077b6;
                    }
                    .ticket-details {
                        background-color: #f9f9f9;
                        padding: 10px;
                        border-radius: 3px;
                    }
                    .ticket-details p {
                        margin: 5px 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <img src="https://dakshayanthra.in/assets/titleCard.png" style="width: 100%;height: auto;">
                    <h1>ProShow Ticket</h1>
                    <p>Dear ${name},</p>
                    <p>Thank you for your registration for our upcoming event. Here are the details of your ticket:</p>
                    <div class="ticket-details">
                        <p><strong>Ticket Number:</strong> ${id}</p>
                        <p><strong>Event Name:</strong> Daksha Yanthra Proshow</p>
                        <p><strong>Date:</strong> 5/05/2024</p>
                        <p><strong>Entry Time:</strong> 05:30 PM </p>
                        <p><strong>Show Time:</strong> 06:00 PM </p>
                        <p><strong>Venue:</strong> College Main Stage</p>
                    </div>
                    <p>Please present this ticket (along with the QR code below) at the event registration desk for entry.</p>
                    <img src="cid:qrcode@nodemailer.com" alt="Ticket QR Code">
                    <p>We look forward to seeing you at the event!</p>
                    <p>Best regards,<br>
                    Daksha Yanthra Events Team</p>
                </div>
            </body>
            </html>
                `;

            qrcode.toFile('qrCode.png', id, { errorCorrectionLevel: 'H' }, (err) => {
                if (err) throw err;

                const attachment = [{
                    filename: 'qrCode.png',
                    path: './qrCode.png',
                    cid: 'qrcode@nodemailer.com'
                }];

                sendMail(email, "Daksha Yanthra Pro Show Ticket", htmlTemplate, attachment);
            });
            //await a delay of 5 seconds
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    } catch (err) {
        console.log(err);
    }
}

exports.getProshowDetails = async (req, res) => {
    try {
        const proshow = await Proshow.findOne({ uniqueString: req.params.id }).exec();

        if (!proshow) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: proshow });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}