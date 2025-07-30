const BaseRepo = require('../services/BaseRepository');
const { HospitalModel, AppointmentModel, UserModel, SelfAssessmentTestModel } = require('../models');
const { validationResult } = require('express-validator');
const { decrypt } = require('../utils/crypto');
const crypto = require('crypto');
const sendEmail = require('../mailer/mailerFile');
const { Op } = require('sequelize');
const e = require('express');


module.exports.add = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    // Check if the email already exists
    const existingHospital = await HospitalModel.findOne({ where: { email: req.body.email } });
    if (existingHospital) {
        return res.status(400).json({ error: 'Email already exists' });
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

        const first_name = decrypt(user.dataValues.first_name, user.dataValues.first_name_iv, user.dataValues.first_name_auth_tag);
        const last_name = decrypt(user.dataValues.last_name, user.dataValues.last_name_iv, user.dataValues.last_name_auth_tag);
        const phone = decrypt(user.dataValues.phone, user.dataValues.phone_iv, user.dataValues.phone_auth_tag);
        const emailId = decrypt(user.dataValues.email, user.dataValues.email_iv, user.dataValues.email_auth_tag);
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
        const data = await BaseRepo.baseUpdate(AppointmentModel, { id }, payload);
        if (!data) {
            return res.status(400).json({ error: 'Error updating Appointment' });
        }

        console.log("data value ", data.dataValues.user_id);

        // find the user email according to user_id
        const user = await BaseRepo.baseFindById(UserModel, data.dataValues.user_id, "id");
        if (!user) {
            return res.status(400).json({ error: 'Error fetching User Details' });
        }
        const emailId = decrypt(user.dataValues.email, user.dataValues.email_iv, user.dataValues.email_auth_tag);

        // Collect appointment details in a variable.
        const appointmentDetails = {
            appointment_date: data.dataValues.appointment_date,
            appointment_time: data.dataValues.appointment_time,
            hospital_name: data.dataValues.hospital_name,
        };


        // check if appointment_status is confirmed or cancelled and then apply the condition
        if (payload.appointment_status === 'confirmed') {
            // Send a appointment confirmation Email to the user
            sendEmail(appointmentDetails, 4, emailId);


             // Check if User has any conflicting appointments. any Scheduled or confirmed appointments within ± 7 days from confirmed booking date
                let minDate = new Date(data.dataValues.appointment_date);
                minDate.setDate(minDate.getDate() - 5);
                const convertedMinDate = minDate.toISOString().split('T')[0];
            
                let maxDate = new Date(data.dataValues.appointment_date);
                maxDate.setDate(maxDate.getDate() + 9);
                const convertedMaxDate = maxDate.toISOString().split('T')[0];
            
                //console.log("minDate:", convertedMinDate, "maxDate:", convertedMaxDate);
            
                const conflictAppointment = await BaseRepo.baseGetConflictingAppointmentsScheduled(AppointmentModel, convertedMinDate, convertedMaxDate, data.dataValues.user_id);
                if (!conflictAppointment) {
                    //console.log('Booking not allowed: already a confirmed appointment within ±7 days.');
                    console.log("conflictAppointment details:", conflictAppointment);
                }
        }
        else if (payload.appointment_status === 'cancelled') {
            // Send a appointment cancellation Email to the user
            sendEmail(appointmentDetails, 5, emailId);
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