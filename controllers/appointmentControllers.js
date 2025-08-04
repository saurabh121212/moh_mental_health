const BaseRepo = require('../services/BaseRepository');
const { AppointmentModel, HospitalModel, UserModel } = require('../models');
const { validationResult } = require('express-validator');
const sendEmail = require('../mailer/mailerFile');
const { decrypt } = require('../utils/crypto');


module.exports.add = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    const payload = req.body;

    // console.log("check is_with_test value:", req.body.is_with_test);
    // // console is_with_test type
    // console.log("is_with_test type:", typeof req.body.is_with_test);

    // console.log("check self_assessment_test_id value:", req.body.self_assessment_test_id);

    // Check if User has any conflicting appointments. any confirmed appointments which is 7days from requested booking date
    let minDate = new Date(payload.appointment_date);
    minDate.setDate(minDate.getDate() - 5);
    const convertedMinDate = minDate.toISOString().split('T')[0];

    let maxDate = new Date(payload.appointment_date);
    maxDate.setDate(maxDate.getDate() + 9);
    const convertedMaxDate = maxDate.toISOString().split('T')[0];

    //console.log("minDate:", convertedMinDate, "maxDate:", convertedMaxDate);

    const conflictCount = await BaseRepo.baseGetConflictingAppointments(AppointmentModel, convertedMinDate, convertedMaxDate, payload.user_id);
    if (conflictCount > 0) {
        //console.log('Booking not allowed: already a confirmed appointment within ±7 days.');
        return res.status(400).json(
            { error: 'Booking not allowed: already a confirmed appointment within ±7 days.' }
        );
    }

    // if (req.body.is_with_test === false) req.body.is_with_test = true
    // else if (req.body.is_with_test === true) {
    //     req.body.is_with_test = false
    //     req.body.self_assessment_test_id = null
    // }

    try {
        const data = await BaseRepo.baseCreate(AppointmentModel, payload);
        if (!data) {
            return res.status(400).json({ error: 'Error creating Appointment data' });
        }

        const user = await BaseRepo.baseFindById(UserModel, req.body.user_id, "id");
        if (!user) {
            return res.status(400).json({ error: 'Error fetching User Details' });
        }

        const emailId = user.dataValues.email;

        // Send a Email to the user
        sendEmail(payload, 3, emailId);
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
        const data = await BaseRepo.baseList(AppointmentModel, params);
        if (!data) {
            return res.status(400).json({ error: 'Error fetching Appointment data' });
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
    const userId = req.params.id;

    // Validate userId
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    const params = {
        searchParams: { user_id: userId },
        limit: limit,
        offset: offset,
        page: page,
        order: [["id", "DESC"]],
    }

    try {
        const data = await BaseRepo.baseList(AppointmentModel, params);
        if (!data) {
            return res.status(400).json({ error: 'Error fetching Appointment data' });
        }
        res.status(201).json(data);
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

        // console.log("Appointment updated successfully:", data);

        // send email notification if appointment is completed
        // if (payload.appointment_status === 'completed') {
        //     const user = await BaseRepo.baseFindById(UserModel, payload.user_id, "id");
        //     if (!user) {
        //         return res.status(400).json({ error: 'Error fetching User Details'});
        //     }
        //     const emailId = decrypt(user.dataValues.email, user.dataValues.email_iv, user.dataValues.email_auth_tag);
        //     // Send a Email to the user
        //     sendEmail(payload, 4, emailId);
        // }

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


module.exports.cancelAppointment = async (req, res, next) => {

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

        // console.log("Appointment updated successfully:", data);

        // send email notification if appointment is completed
        // if (payload.appointment_status === 'completed') {
        //     const user = await BaseRepo.baseFindById(UserModel, payload.user_id, "id");
        //     if (!user) {
        //         return res.status(400).json({ error: 'Error fetching User Details'});
        //     }
        //     const emailId = decrypt(user.dataValues.email, user.dataValues.email_iv, user.dataValues.email_auth_tag);
        //     // Send a Email to the user
        //     sendEmail(payload, 4, emailId);
        // }

        res.status(201).json({
            message: 'Your appointment has been cancelled successfully',
            data: data
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}



module.exports.upcomingAppointments = async (req, res, next) => {

    const userId = req.body.id;
    const date = req.body.date;
    const time = req.body.time;

    console.log("Upcoming Appointments for User ID:", userId, "Date:", date, "Time:", time);
    // Validate userId
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const data = await BaseRepo.baseGetUpcomingAppointmentsFromUserDateTime(AppointmentModel, userId, date, time);
        if (!data) {
            return res.status(400).json({ error: 'Error fetching Appointment data' });
        }
        res.status(201).json(data);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}



module.exports.hospitalAllAppointmentsDetails = async (req, res, next) => {

    try {
        const data = await BaseRepo.baseGetHospitalAppointmentsFullDetails(HospitalModel, AppointmentModel);
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


module.exports.hospitalAllAppointmentsList = async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const hospitalId = req.params.id;
    const appointment_status = req.query.appointment_status;

    console.log("Hospital ID:", hospitalId);
    console.log("Appointment Status:", appointment_status);

    const params = {
        searchParams: { "hospital_id": hospitalId, "appointment_status": appointment_status },
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



module.exports.lastAppointmentCount = async (req, res, next) => {

    const user_id = req.params.id;
    try {
        const data = await BaseRepo.baseGetAppointmentsCountByUserId(AppointmentModel, user_id);
        console.log("Last Appointment Count Data:", data);
        if (!data || data == 0) {
            return res.status(201).json(
                {
                    message: 'No appointments found for this user',
                    count: 0,
                    bookAppointment: true
                });
        }
        else if (data >= 2) {
            return res.status(201).json(
                {
                    message: 'User has already booked 2 appointments. Cannot book more appointments.',
                    count: data,
                    bookAppointment: false
                });
        }
        else if (data < 2) {
            return res.status(201).json(
                {
                    message: 'User have less than or equal to 2 appointments',
                    count: data,
                    bookAppointment: true
                });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}