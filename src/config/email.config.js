const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com", // Replace with your Hostinger SMTP server
    port: 465, // Use 587 for TLS or 465 for SSL
    secure: true, // true for SSL
    auth: {
        user: process.env.EMAIL_USER, // Your Hostinger email
        pass: process.env.EMAIL_PASS, // Your email password
    },
});

module.exports = {transporter};