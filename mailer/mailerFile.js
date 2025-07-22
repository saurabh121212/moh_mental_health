const nodemailer = require('nodemailer');
const emailTemplate = require('./emailTemplate')
const CONFIG     = require("../config/config");

// Email id :- undpmsme2025@gmail.com
// Password :- Saurabh@123

    let subject;
    let output;

async function sendEmail(payload,status,email,password) {

    console.log("payload",payload);

    if(status==1)
    {
         subject = `OTP for Password Reset`
         output = emailTemplate.passwordResetOTPSend(payload);
    }
   
    if(status==2)
    {
         subject = `Hospital Registration by MOH Administrator check your details`
         output = emailTemplate.hospitalRegisteredTemplate(payload,password);
    }

    if(status==3)
    {
         subject = `Appointment Booking Acknowledgement`
         output = emailTemplate.appointmentBookingTemplate(payload);
    }
    
    let transporter = nodemailer.createTransport(CONFIG.mail)   
    message = {
        from: CONFIG.mail_from,
        to: email,
        subject: subject,
        html: output
    } 

    transporter.sendMail(message, function (error, info) {
        if (error) {
            console.log(error);
            return 0;
        } else {
            console.log('Email sent: ' + info.response);
            console.log(message.from ," ttt ", message.to);
            return 1;
        }
    });
}

module.exports = sendEmail;