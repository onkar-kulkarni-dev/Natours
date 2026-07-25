const nodemailer = require('nodemailer');

const sendEmail = async options => {
    //1. create transport
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    //2.prepare email
    const mailOptions = {
        from: 'Onkar <hello@natours.io>',
        to: options.mailTo,
        subject: options.subject,
        text: options.message
    }
    //3. send email
    await transport.sendMail(mailOptions)
}

module.exports = sendEmail;