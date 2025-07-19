const BaseRepo = require('../services/BaseRepository');
const { MoodModel } = require('../models');
const { validationResult } = require('express-validator');


module.exports.add = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    const payload = req.body;
    try {
        const data = await BaseRepo.baseCreate(MoodModel, payload);
        if (!data) {
            return res.status(400).json({ error: 'Error creating Moods data' });
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
        const data = await BaseRepo.baseList(MoodModel, params);
        if (!data) {
            return res.status(400).json({ error: 'Error fetching Moods data' });
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
        const data = await BaseRepo.baseList(MoodModel, params);
        if (!data) {
            return res.status(400).json({ error: 'Error fetching Moods data' });
        }
        res.status(201).json(data);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}



module.exports.getMoodStatistics = async (req, res, next) => {

    const user_id = req.params.id;
    try {
        const data = await BaseRepo.baseGetMoodCountsByUser(MoodModel, user_id);
        if (!data) {
            return res.status(400).json({ error: 'Error fetching Moods data' });
        }

        result = calculateMentalWellnessScore(data.happy, data.neutral, data.sad);
        res.status(201).json({
            data: data,
            mentalWellnessScore: result.score + "%",
            mentalWellnessStatus: result.status
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


function calculateMentalWellnessScore(happy, neutral, sad) {
    const total = happy + neutral + sad;

    if (total === 0) {
        return {
            score: 0,
            status: "No data available"
        };
    }

    const weightedScore = (happy * 1) + (neutral * 0.5) + (sad * 0);
    const percentageScore = (weightedScore / total) * 100;

    let status = "";

    if (percentageScore > 60 && percentageScore <= 100) {
        status = "You are doing great. Keep it up";
    } else if (percentageScore > 40 && percentageScore <= 60) {
        status = "Your mental state is stable";
    } else if (percentageScore > 20 && percentageScore <= 40) {
        status = "Your mental health condition could be better";
    } else if (percentageScore >= 0 && percentageScore <= 20) {
        status = "Critical mental state – Seek help";
    }
    return {
        score: percentageScore.toFixed(0),
        status: status
    };
}