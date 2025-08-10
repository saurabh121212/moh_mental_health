const BaseRepo = require('../services/BaseRepository');
const { SelfAssessmentTestModel } = require('../models');
const { validationResult } = require('express-validator');


module.exports.add = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    const payload = req.body;
    console.log("Payload received for Self Assessment Test:", payload);

    try {
        const data = await BaseRepo.baseCreate(SelfAssessmentTestModel, payload);
        if (!data) {
            return res.status(400).json({ error: 'Error creating Self Assessment Test data' });
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
        const data = await BaseRepo.baseList(SelfAssessmentTestModel, params);
        if (!data) {
            return res.status(400).json({ error: 'Error fetching Self Assessment Test data' });
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
        const data = await BaseRepo.baseList(SelfAssessmentTestModel, params);
        if (!data) {
            return res.status(400).json({ error: 'Error fetching Self Assessment Test data' });
        }
        res.status(201).json(data);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports.getUserLastSelfAssessmentTest = async (req, res, next) => {

    const date = req.query.date;
    const userId = req.params.id;


    // find the last self-assessment test for the user
    const params = {
        searchParams: {
            user_id: userId,
        },
        limit: 1,
        order: [["createdAt", "DESC"]],
    }

    try {
        const data = await BaseRepo.baseList(SelfAssessmentTestModel, params);
        if (!data || data.values.rows.length === 0) {
           return res.status(201).json({
                message: 'You have not taken any self-assessment test yet. Please take a test to check your mental health status.',
                lastAppointment: null,
                diffInDays: null,
                nextAppointmentDate: null,
                bookAppointment: true
            });
        }
        
        const lastAppointment = data.values.rows[0].dataValues.createdAt;

        if (lastAppointment) {
            const givenDate = new Date(date); // example input
            const appointmentDate = new Date(lastAppointment);

            const diffInMs = givenDate - appointmentDate;
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

            const diffInDaysRounded = Math.floor(diffInDays);

            // Add 14 days
            const nextAppointmentDate = new Date(lastAppointment);
            nextAppointmentDate.setDate(nextAppointmentDate.getDate() + 14);


                console.log("diffInDaysRounded check", diffInDaysRounded);
            // if (diffInDaysRounded >= 13) {
            if (diffInDaysRounded >= -1){
               return res.status(201).json({
                    message: 'Last self-assessment test is older than 14 days.',
                    lastAppointment: lastAppointment,
                    diffInDays: diffInDaysRounded,
                    nextAppointmentDate:null,
                    bookAppointment: true
                });
            } else {
              return res.status(201).json({
                    message: `You last undertook a self-assessment test on the ${lastAppointment.toISOString().split('T')[0]}. The next test will be available after ${nextAppointmentDate.toISOString().split('T')[0]}.`,
                    lastAppointment: lastAppointment,
                    diffInDays: diffInDaysRounded,
                    nextAppointmentDate: nextAppointmentDate.toISOString().split('T')[0],
                    bookAppointment: false
                })
            }
        } 
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}



