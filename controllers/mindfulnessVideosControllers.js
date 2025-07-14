const BaseRepo = require('../services/BaseRepository');
const { MindfulnessVideosModel } = require('../models');
const { validationResult } = require('express-validator');


module.exports.add = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    const payload = req.body;
    try {
        const data = await BaseRepo.baseCreate(MindfulnessVideosModel, payload);
        if (!data) {
            return res.status(400).json({ error: 'Error creating Mindfulness Videos' });
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
        const data = await BaseRepo.baseList(MindfulnessVideosModel, params);
        if (!data) {
            return res.status(400).json({ error: 'Error fetching Mindfulness Videos'});
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
        const data = await BaseRepo.baseList(MindfulnessVideosModel, params);
        if (!data) {
            return res.status(400).json({ error: 'Error fetching Mindfulness Videos' });
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
        const data = await BaseRepo.baseUpdate(MindfulnessVideosModel, { id }, payload);
        if (!data) {
            return res.status(400).json({ error: 'Error updating Mindfulness Videos' });
        }
        res.status(201).json({
            message: 'Mindfulness Videos updated successfully',
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
        const data = await BaseRepo.baseDelete(MindfulnessVideosModel, { id });
        if (!data) {
            return res.status(400).json({ error: 'Error deleting Mindfulness Videos' });
        }
        res.status(201).json({
            message: 'Mindfulness Videos deleted successfully',
            data: data
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}