
// Password Reset Email
const passwordResetOTPSend = (payload, email) =>
    `<html>
<head>
    <title></title>
</head>
<body>
    <!-- Take only this part for email -->
   
    <b>Dear User,</b> <br>
    <p>We received a request to reset the password for your account.</p> 
    <p>Your One-Time Password (OTP) is:</p>
    ${payload}
    <p>This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
    <p>If you did not request this, please ignore this email.</p>

    <br>
    <b>Regards,</b><br>
    Eswatini Nursing Council Admin
    <br><br>
    Email: To be added later<br>
    Tel: To be added later<br>
    Fax: To be added later<br>
    Cell: To be added later
    <br><br><br>
    <p style="color:red;"> *This is a system generated message, please do not reply to this email.</p>
    </body>
    </html>`


// Hospital Registration Email Template
// This is use to send email to the hospital at the time of registration by MOH Admin
const hospitalRegisteredTemplate = (payload, password) =>
    `<html>
    <head>
        <title></title>
    </head>
    <body>
        <b>Dear ${payload.name || 'User'},</b> <br>
        <p>We are pleased to inform you that the system administrator has registered your hospital on the Eswatini Nursing Council Platform.</p> 
        <p>Please use the following credentials to log in and verify your hospital details:</p>
        <ul>
            <li><b>Username:</b> ${payload.email}</li>
            <li><b>Password:</b> ${password}</li>
        </ul>
        
        <p>If you have any questions or require further assistance, please feel free to reach out.</p>
        <p>Welcome aboard!</p>
        
    <br>
    <b>Regards,</b><br>
    Eswatini Nursing Council Admin
    <br><br>
    Email: To be added later<br>
    Tel: To be added later<br>
    Fax: To be added later<br>
    Cell: To be added later
    <br><br><br>
        <p style="color:red;">*This is a system generated message, please do not reply to this email.</p>
    </body>
    </html>
    `


const appointmentBookingTemplate = (payload) =>
    `<html>
    <head>
        <title>Appointment Request Confirmation</title>
    </head>
    <body>
        <b>Dear ${payload.name || 'User'},</b><br>
        
        <p>We have received your appointment request and successfully forwarded it to the hospital.</p>
        
        <p><b>Appointment Details:</b></p>
        <ul>
            <li><b>Date:</b> ${payload.appointment_date}</li>
            <li><b>Time:</b> ${payload.appointment_time}</li>
            <li><b>Hospital:</b> ${payload.hospital_name}</li>
        </ul>

        <p>Once the hospital reviews and approves your appointment, you will receive a notification from us.</p>
        
        <p>If you have any questions or require further assistance, please feel free to reach out.</p>
        
        <p>Thank you for using the Eswatini Nursing Council Platform.</p>
        
    <br>
    <b>Regards,</b><br>
    Eswatini Nursing Council Admin
    <br><br>
    Email: To be added later<br>
    Tel: To be added later<br>
    Fax: To be added later<br>
    Cell: To be added later
    <br><br><br>
        <p style="color:red;">*This is a system generated message, please do not reply to this email.</p>
    </body>
  </html>`;


const appointmentConfirmationTemplate = (payload) =>
    `<html>
    <head>
        <title>Appointment Confirmation</title>
    </head>
    <body>
        <b>Dear ${payload.name || 'User'},</b><br>
        
        <p>Your appointment has been <b>confirmed</b> by the hospital.</p>
        
        <p><b>Appointment Details:</b></p>
        <ul>
            <li><b>Date:</b> ${payload.appointment_date}</li>
            <li><b>Time:</b> ${payload.appointment_time}</li>
            <li><b>Hospital:</b> ${payload.hospital_name}</li>
        </ul>

        <p>Please make sure to arrive at the hospital on time and bring any necessary documents, if required.</p>
        
        <p>If you have any questions or need to reschedule, please contact the hospital directly.</p>
        
        <p>Thank you for using the Eswatini Nursing Council Platform.</p>
        
         <br>
    <b>Regards,</b><br>
    Eswatini Nursing Council Admin
    <br><br>
    Email: To be added later<br>
    Tel: To be added later<br>
    Fax: To be added later<br>
    Cell: To be added later
    <br><br><br>
        <p style="color:red;">*This is a system generated message, please do not reply to this email.</p>
    </body>
  </html>`;


const appointmentCancellationTemplate = (payload) =>
    `<html>
    <head>
        <title>Appointment Cancellation Notice</title>
    </head>
    <body>
        <b>Dear ${payload.name || 'User'},</b><br>
        
        <p>We regret to inform you that your appointment has been <b>cancelled</b>.</p>
        
        <p><b>Appointment Details:</b></p>
        <ul>
            <li><b>Date:</b> ${payload.appointment_date}</li>
            <li><b>Time:</b> ${payload.appointment_time}</li>
            <li><b>Hospital:</b> ${payload.hospital_name}</li>
        </ul>

        <p>If this cancellation was unexpected or you wish to reschedule, please contact the hospital or submit a new appointment request through the Eswatini Nursing Council Platform.</p>
        
        <p>We apologize for any inconvenience caused.</p>
        
        <p>Thank you for using the Eswatini Nursing Council Platform.</p>
        
   <br>
    <b>Regards,</b><br>
    Eswatini Nursing Council Admin
    <br><br>
    Email: To be added later<br>
    Tel: To be added later<br>
    Fax: To be added later<br>
    Cell: To be added later
    <br><br><br>
        <p style="color:red;">*This is a system generated message, please do not reply to this email.</p>
    </body>
  </html>`;


const registrationOTPSend = (otp, email) =>
    `<html>

    <b>Dear User,</b><br>
    <p>Thank you for registering on the <b>Eswatini Nursing Council Platform</b>.</p>
    <p>To complete your registration, please verify your email address using the One-Time Password (OTP) below:</p>
    
    <h2>${otp}</h2>

    <p>Please do not share this code with anyone.</p>
    <p>If you did not initiate this registration, please ignore this email.</p>

     <br>
    <b>Regards,</b><br>
    Eswatini Nursing Council Admin
    <br><br>
    Email: To be added later<br>
    Tel: To be added later<br>
    Fax: To be added later<br>
    Cell: To be added later
    <br><br><br>
    <p style="color:red;">*This is a system-generated message, please do not reply to this email.</p>
</body>
</html>`;


module.exports = {
    hospitalRegisteredTemplate,
    passwordResetOTPSend,
    appointmentBookingTemplate,
    appointmentConfirmationTemplate,
    appointmentCancellationTemplate,
    registrationOTPSend
}