const BaseRepo = require('../services/BaseRepository');
const { HospitalModel } = require('../models');
const { validationResult } = require('express-validator');


module.exports.add = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    // Check if the email already exists
    const existingHospital = await HospitalModel.findOne({ where: { email: req.body.email }});
    if (existingHospital) {
        return res.status(400).json({ error: 'Email already exists' });
    }

    // Create hash password
    req.body.password = await HospitalModel.hashPassword(req.body.password);

    const payload = req.body;
    try {
        const data = await BaseRepo.baseCreate(HospitalModel, payload);
        if (!data) {
            return res.status(400).json({ error: 'Error creating Hospital' });
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
        const data = await BaseRepo.baseList(HospitalModel, params);
        if (!data) {
            return res.status(400).json({ error: 'Error fetching Hospital'});
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
            message: 'Support Resources updated successfully',
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
            message: 'SHospital deleted successfully',
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

    const hospital = await HospitalModel.findOne({ where: {email}});
    if (!hospital) {
        return res.status(400).json({ error: 'Invalid email or password 1' });
    }

    const isMatch = await hospital.comparePassword(password); 
    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password 2' });
    }

    const token = await hospital.generateAuthToken(); // ✅ instance method
    res.status(200).json({ hospital, token });
};
