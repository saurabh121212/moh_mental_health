const BaseRepo = require('../services/BaseRepository');
const { AppointmentModel } = require('../models');
const { validationResult } = require('express-validator');


module.exports.add = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    const payload = req.body;

    console.log("check is_with_test value:", req.body.is_with_test);
    // console is_with_test type
    console.log("is_with_test type:", typeof req.body.is_with_test);

    console.log("check self_assessment_test_id value:", req.body.self_assessment_test_id);

    if(req.body.is_with_test===false) 
    {
        req.body.is_with_test = true
    }
    else if(req.body.is_with_test===true)
    {
        req.body.is_with_test = false    
        req.body.self_assessment_test_id = null
    }

    try {
        const data = await BaseRepo.baseCreate(AppointmentModel, payload);
        if (!data) {
            return res.status(400).json({ error: 'Error creating Appointment data' });
        }
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
        searchParams: {user_id: userId},
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
        const data = await BaseRepo.baseGetUpcomingAppointmentsFromUserDateTime( AppointmentModel, userId, date, time);
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
