const BaseRepo = require('../services/BaseRepository');
const { HospitalModel, AppointmentModel, UserModel, SelfAssessmentTestModel } = require('../models');
const { validationResult } = require('express-validator');
const { decrypt } = require('../utils/crypto');
const crypto = require('crypto');
const sendEmail = require('../mailer/mailerFile');
const { Op } = require('sequelize');
const e = require('express');
const sendNotification = require('../firebase/sendNotification');
const admin = require('firebase-admin');


module.exports.add = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    // Check if the email already exists
    const existingHospital = await HospitalModel.findOne({ where: { email: req.body.email } });
    if (existingHospital) {
        return res.status(400).json({ error: 'Email already exists in the system please use a different email' });
    }

    // Create hash password
    const password = generatePassword(12);
    req.body.password = await HospitalModel.hashPassword(password);

    const payload = req.body;
    try {
        const data = await BaseRepo.baseCreate(HospitalModel, payload);
        if (!data) {
            return res.status(400).json({ error: 'Error creating Hospital' });
        }

        // Send email with password
        sendEmail(payload, 2, payload.email, password);

        res.status(201).json(data);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports.get = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const params = {
        searchParams: {},
        limit: limit,
        offset: offset,
        page: page,
        order: [["id", "DESC"]],
    }
    try {
        const data = await BaseRepo.baseList(HospitalModel, params);
        if (!data) {
            return res.status(400).json({ error: 'Error fetching Hospital' });
        }
        res.status(201).json(data);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}



module.exports.getMobile = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const params = {
        searchParams: {},
        limit: limit,
        offset: offset,
        page: page,
        order: [["id", "DESC"]],
    }

    try {
        const data = await BaseRepo.baseList(HospitalModel, params);
        if (!data) {
            return res.status(400).json({ error: 'Error fetching Hospital' });
        }
        res.status(201).json(data);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}



module.exports.update = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    const payload = req.body;
    const id = req.params.id;

    try {
        const data = await BaseRepo.baseUpdate(HospitalModel, { id }, payload);
        if (!data) {
            return res.status(400).json({ error: 'Error updating Hospital' });
        }
        res.status(201).json({
            message: 'Hospital updated successfully',
            data: data
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports.delete = async (req, res, next) => {

    const id = req.params.id;

    try {
        const data = await BaseRepo.baseDelete(HospitalModel, { id });
        if (!data) {
            return res.status(400).json({ error: 'Error deleting Hospital' });
        }
        res.status(201).json({
            message: 'Hospital deleted successfully',
            data: data
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports.loginHospital = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    const { email, password } = req.body;

    const hospital = await HospitalModel.findOne({ where: { email } });
    if (!hospital) {
        return res.status(400).json({ error: 'Invalid email ID' });
    }

    const isMatch = await hospital.comparePassword(password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email ID or password' });
    }

    const token = await hospital.generateAuthToken(); // ✅ instance method
    res.status(200).json({ hospital, token });
};



module.exports.hospitalAllAppointments = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const hospitalId = req.params.id;

    console.log("Hospital ID:", hospitalId);

    const params = {
        searchParams: { "hospital_id": hospitalId },
        limit: limit,
        offset: offset,
        page: page,
        order: [["id", "DESC"]],
    }
    try {
        const data = await BaseRepo.baseList(AppointmentModel, params);
        if (!data) {
            return res.status(400).json({ error: 'Error fetching Appointments' });
        }

        res.status(201).json(data);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports.getUserDetails = async (req, res, next) => {

    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const user = await BaseRepo.baseFindById(UserModel, userId, "id");
        if (!user) {
            return res.status(400).json({ error: 'Error fetching User Details' });
        }

        const first_name =user.dataValues.first_name;
        const last_name = user.dataValues.last_name;
        const phone =user.dataValues.phone;
        const emailId = user.dataValues.email;
        const national_id = user.dataValues.national_id;
        const ENC_number = user.dataValues.ENC_number;

        res.status(200).json({
            message: 'User Details fetched successfully',
            data: {
                first_name, last_name, phone, email: emailId, national_id, ENC_number,
                alias_name: user.dataValues.alias_name,
                system_generated_name: user.dataValues.system_generated_name,
                gender: user.dataValues.gender,
                region: user.dataValues.region,
                address: user.dataValues.address,
                clinic: user.dataValues.clinic,
                cadre: user.dataValues.cadre,
            }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}



module.exports.getAssessmentTestDetails = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const userId = req.params.id;

    console.log("userId ID:", userId);

    const params = {
        searchParams: { "user_id": userId },
        limit: limit,
        offset: offset,
        page: page,
        order: [["id", "DESC"]],
    }
    try {
        const assessmentTest = await BaseRepo.baseList(SelfAssessmentTestModel, params);
        if (!assessmentTest) {
            return res.status(400).json({ error: 'Error fetching Assessment Test Details' });
        }

        res.status(200).json(
            {
                message: 'Assessment Test Details fetched successfully',
                data: assessmentTest
            });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports.acceptRejectAppointment = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    const payload = req.body;
    const id = req.params.id;

    try {
        const data2 = await BaseRepo.baseUpdate(AppointmentModel, { id }, payload);
        if (!data2) {
            return res.status(400).json({ error: 'Error updating Appointment' });
        }

        // Get Appointment details
        const data = await BaseRepo.baseFindById(AppointmentModel, id, "id");


        // find the user email according to user_id
        const user = await BaseRepo.baseFindById(UserModel, data.dataValues.user_id, "id");
        if (!user) {
            return res.status(400).json({ error: 'Error fetching User Details' });
        }
        const emailId = user.dataValues.email;
        const token = user.dataValues.device_token;

        // Collect appointment details in a variable.
        const appointmentDetails = {
            appointment_date: data.dataValues.appointment_date.toISOString().split('T')[0],
            appointment_time: data.dataValues.appointment_time,
            hospital_name: data.dataValues.hospital_name,
            hospital_comments: data.dataValues.hospital_comments
        };


        // check if appointment_status is confirmed or cancelled and then apply the condition
        if (payload.appointment_status === 'confirmed') {
            // Send a appointment confirmation Email to the user
            sendEmail(appointmentDetails, 4, emailId);
            // Send a appointment confirmation Notification to the user
            const message = {
                notification: {
                    title: "Appointment Confirmed",
                    body: `Your appointment with ${data.dataValues.hospital_name} on ${data.dataValues.appointment_date.toISOString().split('T')[0]} at ${data.dataValues.appointment_time} has been confirmed by the hospital.`,
                },
                data: {
                    notificationType: "appointment",
                },
                token,
            };
            try {
                const response = await admin.messaging().send(message);
                console.info('✅ Notification sent successfully:', response);
            } catch (error) {
                console.error('❌ Error sending notification:', error.message);
            }
            //console.log("Inside confirmed appointment status");

            // Check if User has any conflicting appointments. any Scheduled or confirmed appointments within ± 7 days from confirmed booking date
            let minDate = new Date(data.dataValues.appointment_date);
            minDate.setDate(minDate.getDate() - 5);
            const convertedMinDate = minDate.toISOString().split('T')[0];

            let maxDate = new Date(data.dataValues.appointment_date);
            maxDate.setDate(maxDate.getDate() + 9);
            const convertedMaxDate = maxDate.toISOString().split('T')[0];

            //console.log("minDate:", convertedMinDate, "maxDate:", convertedMaxDate);

            let conflictAppointment = await BaseRepo.baseGetConflictingAppointmentsScheduled(AppointmentModel, convertedMinDate, convertedMaxDate, data.dataValues.user_id);
            if (conflictAppointment) {
                //console.log('Booking not allowed: already a confirmed appointment within ±7 days.');
                // console.log("conflictAppointment details:", conflictAppointment);
                conflictAppointment = conflictAppointment.dataValues;
                const appointmentId = conflictAppointment.id;

                payload.appointment_status = 'cancelled';
                payload.hospital_comments = `An appointment was automatically canceled as it was within 7 days of another confirmed booking.`;

                const appointmentData = await BaseRepo.baseUpdate(AppointmentModel, { id: appointmentId }, payload);
                if (!appointmentData) {
                    console.error('Error updating Appointment with conflict ');
                }
                //console.log("One of your appointment is already confirmed. Appointment cancelled due to conflicting appointment. Email sent to the user.");

                const appointmentDetails2 = {
                    appointment_date: conflictAppointment.appointment_date.toISOString().split('T')[0],
                    appointment_time: conflictAppointment.appointment_time,
                    hospital_name: conflictAppointment.hospital_name,
                    hospital_comments: conflictAppointment.hospital_comments
                };

                sendEmail(appointmentDetails2, 5, emailId);
                // Send Notification to the user 
                const message = {
                    notification: {
                        title: "Conflicting Appointment Cancelled",
                        body: "One of your appointments has already been confirmed within the last 7 days. Therefore, another appointment has been cancelled.",
                    },
                    data: {
                        notificationType: "appointment",
                    },
                    token,
                };
                try {
                    const response = await admin.messaging().send(message);
                    console.info('✅ Notification sent successfully:', response);
                } catch (error) {
                    console.error('❌ Error sending notification:', error.message);
                }
            }
        }
        else if (payload.appointment_status === 'cancelled') {
            // Send a appointment cancellation Email to the user
            sendEmail(appointmentDetails, 5, emailId);
            // Send a appointment cancellation Notification to the user
            const message = {
                notification: {
                    title: "Appointment Cancelled",
                    body: `Your appointment with ${data.dataValues.hospital_name} on ${data.dataValues.appointment_date.toISOString().split('T')[0]} at ${data.dataValues.appointment_time} has been cancelled by the hospital.`,
                },
                data: {
                    notificationType: "appointment",
                },
                token,
            };
            try {
                const response = await admin.messaging().send(message);
                console.info('✅ Notification sent successfully:', response);
            } catch (error) {
                console.error('❌ Error sending notification:', error.message);
            }
        }

        res.status(201).json({
            message: 'Appointment updated successfully',
            data: data
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports.rejectAppointment = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    const payload = req.body;
    const id = req.params.id;

    try {
        const data = await BaseRepo.baseUpdate(AppointmentModel, { id }, payload);
        if (!data) {
            return res.status(400).json({ error: 'Error updating Appointment' });
        }
        res.status(201).json({
            message: 'Appointment updated successfully',
            data: data
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}




module.exports.hospitalAllConfirmedAppointments = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const hospitalId = req.params.id;

    console.log("Hospital ID:", hospitalId);

    const params = {
        searchParams: { "hospital_id": hospitalId, "appointment_status": "confirmed" },
        limit: limit,
        offset: offset,
        page: page,
        order: [["id", "DESC"]],
    }
    try {
        const data = await BaseRepo.baseList(AppointmentModel, params);
        if (!data) {
            return res.status(400).json({ error: 'Error fetching Appointments' });
        }
        res.status(201).json(data);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.hospitalAllRejectedAppointments = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const hospitalId = req.params.id;

    console.log("Hospital ID:", hospitalId);

    const params = {
        searchParams: { "hospital_id": hospitalId, "appointment_status": "cancelled" },
        limit: limit,
        offset: offset,
        page: page,
        order: [["id", "DESC"]],
    }
    try {
        const data = await BaseRepo.baseList(AppointmentModel, params);
        if (!data) {
            return res.status(400).json({ error: 'Error fetching Appointments' });
        }
        res.status(201).json(data);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports.hospitalAllUpcomingAppointments = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const hospitalId = req.params.id;
    const date = req.query.date
    const [day, month, year] = date.split('-');
    const today = new Date(`${year}-${month}-${day}`); // to YYYY-MM-DD;

    const params = {
        searchParams: {
            hospital_id: hospitalId,
            appointment_status: { [Op.in]: ['scheduled', 'confirmed'] },
            appointment_date: { [Op.gte]: today }
        },
        order: [['appointment_date', 'ASC']],
        limit: limit,
        offset: offset,
        page: page,
    };
    try {
        const data = await BaseRepo.baseList(AppointmentModel, params);
        if (!data) {
            return res.status(400).json({ error: 'Error fetching Appointments' });
        }
        res.status(201).json(data);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports.hospitalAllPastAppointments = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const hospitalId = req.params.id;
    const date = req.query.date
    const [day, month, year] = date.split('-');
    const today = new Date(`${year}-${month}-${day}`); // to YYYY-MM-DD;

    const params = {
        searchParams: {
            hospital_id: hospitalId,
            appointment_date: { [Op.lte]: today }
        },
        order: [['appointment_date', 'ASC']],
        limit: limit,
        offset: offset,
        page: page,
    };
    try {
        const data = await BaseRepo.baseList(AppointmentModel, params);
        if (!data) {
            return res.status(400).json({ error: 'Error fetching Appointments' });
        }
        res.status(201).json(data);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


function generatePassword(length = 12) {
    return crypto
        .randomBytes(length)
        .toString('base64')
        .slice(0, length)
        .replace(/[+/]/g, 'A'); // replace special chars if needed
}


module.exports.getAssessmentTestDetailsSingle = async (req, res, next) => {


    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: 'Assessment Test ID is required' });
    }

    console.log("Self Assessment Test ID:", id);
    try {
        const assessmentTest = await BaseRepo.baseFindById(SelfAssessmentTestModel, id, "id");
        if (!assessmentTest) {
            return res.status(400).json({ error: 'Error fetching Assessment Test Details' });
        }

        res.status(200).json(
            {
                message: 'Single Assessment Test Details fetched successfully',
                data: assessmentTest
            });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports.forgetPasswordSendEmail = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    let payload;
    const email = req.params.email;

    const isEmailExist = await HospitalModel.findOne({ where: { email: email } });
    if (!isEmailExist) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expiry = new Date(Date.now() + 10 * 60000); // 10 minutes from now

    payload = { otp: otp, otp_expiry: otp_expiry };

    try {
        const Hospital = await BaseRepo.baseUpdate(HospitalModel, { email }, payload);
        if (!Hospital) {
            return res.status(400).json({ error: 'Error updating Your Password' });
        }

        // Send email to the user
        sendEmail(payload.otp, 1, email);

        res.status(201).json({
            message: 'OTP sent successfully',
            data: Hospital
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports.forgetPasswordVerifyOTP = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    let payload;
    const email = req.params.email;
    const otp = req.params.otp;

    try {
        const record = await HospitalModel.findOne({ where: { email: email, otp: otp } });
        if (!record || record.otp_expiry < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        res.status(201).json({
            message: 'OTP verified successfully',
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports.forgetPassword = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    let payload;
    const email = req.params.email;
    const password = req.params.password;


    const isEmailExist = await HospitalModel.findOne({ where: { email: email } });
    if (!isEmailExist) {
        return res.status(400).json({ error: 'Invalid email address' });
    }
    
    const hashedPassword = await HospitalModel.hashPassword(password.toString());
    payload = { password: hashedPassword, otp: null, otp_expiry: null };

    try {
        const Hospital = await BaseRepo.baseUpdate(HospitalModel, { email }, payload);
        if (!Hospital) {
            return res.status(400).json({ error: 'Error Updating Your Password' });
        }

        res.status(201).json({
            message: 'Reset password successfully',
            data: Hospital
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}



module.exports.hospitalGraphsData = async (req, res, next) => {

    const hospital_id = req.params.id;

    try {
        const data = await BaseRepo.baseGetHospitalTotalAppointmentData(AppointmentModel,hospital_id);
        if (!data) {
            return res.status(400).json({ error: 'Error fetching Hospital Appointments Details' });
        }
        res.status(201).json(data);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}