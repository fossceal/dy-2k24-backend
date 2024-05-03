const Proshow = require("../models/proshow_model");
const { sendMail } = require("../utils/sendMail");
const qrcode = require('qrcode');

//used only once
exports.sendProshowTickets = async () => {

    try {

        const names = [
            "Krishna Priya",
            "Mohammed Jassim N",
            "Shan Muraleedharan",
            "Niveditha S",
            "Niveda Ajith",
            "AKASH",
            "Midhun Sujathan",
            "Shawn Siby George",
            "Dilshan Dileep Shyni",
            "Reuben Roy Vargis",
            "ABHIJEET J KARTHA",
            "Fahad.s",
            "Aashi",
            "Meenakshi S",
            "Harikrishnan",
            "Krishnan Unni"
        ];
        const emails = [
            "krishnapriyabiji1112@gmail.com",
            "jassimwushu@gmail.com",
            "shanmuralidharan99@gmail.com",
            "nivedithastvm@gmail.com",
            "nivedaajith11@gmail.com",
            "iamsorryicanttellyouthat@gmail.com",
            "gitalachu123@gmail.com",
            "sibyshawn@gmail.com",
            "dilshandileep6@gmail.com",
            "reubenroy101@gmail.com",
            "dilshandileep19@gmail.com",
            "hrdfahadml16@gmail.com",
            "irshiks@gmail.com",
            "irshiks@gmail.com",
            "irshiks@gmail.com",
            "unni88970@gmail.com"
        ];
        const phones = [
            "99475 56831",
            "7559960892",
            "8590117668",
            "6238798936",
            "7593068227",
            "8590710105",
            "8592826202",
            "7902642950",
            "9400012411",
            "9645435705",
            "9539277242",
            "8075777930",
            "8590320383",
            "8590320383",
            "8590320383",
            "9496675663"
        ];
        const colleges = [
            "Sree Narayana Guru College of Legal Studies",
            "Mar Ivanios",
            "MGM PTC",
            "Bangalore Institute of Technology",
            "Providence Women's College",
            "Logic School Of Management",
            "Musaliar College of Engineering",
            "Mar Baselios College of Engineering and Technology",
            "Mar Baselios College Of Engineering and Technology",
            "Mar Baselios College of Engineering and Technology",
            "Mar Baselios College of Engineering and Technology",
            "KTCT",
            "Rajadhani Institute Of Engineering And Technology",
            "Rajadhani Institute Of Engineering And Technology",
            "Rajadhani Institute Of Engineering And Technology",
            "Mar Ivanios College Tvm"
        ];

        for (var i = 0; i < emails.length; i++) {
            const name = names[i];
            const email = emails[i];
            const phone = phones[i];
            const college = colleges[i];

            const proshow = await Proshow.create({
                email,
                phone,
                name,
                college,
            });

            const qrCodeData = proshow.id;
            console.log(proshow.id);

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
                    <h1>ProShow Ticket</h1>
                    <p>Dear ${name},</p>
                    <p>Thank you for your registration for our upcoming event. Here are the details of your ticket:</p>
                    <div class="ticket-details">
                        <p><strong>Ticket Number:</strong> ${qrCodeData}</p>
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

            qrcode.toFile('qrCode.png', qrCodeData, { errorCorrectionLevel: 'H' }, (err) => {
                if (err) throw err;

                const attachment = [{
                    filename: 'qrCode.png',
                    path: './qrCode.png',
                    cid: 'qrcode@nodemailer.com'
                }];

                sendMail(email, "Daksha Yanthra Pro Show Ticket", htmlTemplate, attachment);

            });
        }
    } catch (err) {
        console.log(err);
    }
}

exports.getProshowDetails = async (req, res) => {
    try {
        const proshow = await Proshow.findById(req.params.id).exec();

        if (!proshow) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: proshow });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}