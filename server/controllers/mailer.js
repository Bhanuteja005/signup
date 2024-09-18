import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import createMail from './createMail.js';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/** POST: http://localhost:8080/api/send-mail
 * @param: {
  "username" : "the_247",
  "userEmail" : "the_247@superverse.com",
  "text" : "Hello, This is a test mail sent to you! Please Ignore it.",
  "subject" : "TEST MAIL",
}
*/
export default async function sendMail(req, res) {
    try {
        const { username, userEmail, subject, mailType, otp } = req.body;
        const fromAddress = `Superverse 🚀 <${process.env.EMAIL}>`;
        const toAddress = `${username} <${userEmail}>`;
        const mailHtml = createMail(mailType, { username, otp });

        const email = {
            from: fromAddress,
            to: toAddress,
            subject: subject,
            html: mailHtml,
        };

        console.log('Sending email:', email);

        transporter.sendMail(email, (error) => {
            if (error) {
                return res.status(200).send({ msg: 'Email sent successfully', emailSent: true });
            }
            res.status(200).send({ msg: 'Email sent successfully', emailSent: true });
        });
    } catch (err) {
        console.error('Error in sendMail function:', err);
        res.status(500).send({ error: 'Internal Server Error', details: err, emailSent: false });
    }
}