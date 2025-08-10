const BaseRepo = require('../services/BaseRepository');
const { UserMOHSystemModel, UserModel } = require('../models');
const { validationResult } = require('express-validator');
const axios = require('axios');


module.exports.verifyUser = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    const payload = req.body;

    try {
        // Check if national_id and ENC_number are provided request are present in userTable or not
        const isNationalIdExist = await UserModel.findOne({ where: { national_id: payload.national_id } });
        if (isNationalIdExist) {
            return res.status(400).json({ error: 'User already exist with this National Id' });
        }

        const isENCNumberExist = await UserModel.findOne({ where: { ENC_number: payload.ENC_number } });
        if (isENCNumberExist) {
            return res.status(400).json({ error: 'User already exist with this ENC Number' });
        }

        // call nursing council API to verify user.
        const nursingCouncilResponse = await validateRegistration(payload.ENC_number);
        console.log('Nursing Council Response:', nursingCouncilResponse);
        if (!nursingCouncilResponse || nursingCouncilResponse.error) {
            return res.status(400).json({ error: 'Invalid ENC number or user not found under ENC records. Please check and try again.' });
        }

        // Clean the data received from Nursing Council API
        const cleanedData = cleanNurseData(nursingCouncilResponse);
        console.log('Cleaned Data:', cleanedData);
        if (payload.national_id !== cleanedData.IdNum.toString()) {
            return res.status(400).json({ error: 'Your National ID and Eswatini Nursing Council (ENC) number did not match with ENC records.  Please check and try again.' });
        }

        res.status(201).json({
            message: 'User verified successfully',
            data: {
                first_name: cleanedData.NurseName,
                last_name: cleanedData.NurseSurname,
                cadre_title: cleanedData.CadreTitle,
                ENC_number: payload.ENC_number,
                national_id: payload.national_id,
                phone: cleanedData.phone || null, // Optional, can be null
                email: cleanedData.email || null, // Optional, can be null
                address: cleanedData.address || null, // Optional, can be null
                region: cleanedData.region || null, // Optional, can be null
                gender: cleanedData.gender || null, // Optional, can be null
                clinic: cleanedData.clinic || null // Optional, can be null         
            }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


// This is used to call the Nursing Council API to validate the registration number
async function validateRegistration(sncNumber) {
    const url = `https://eswatininursingcouncil.com/health/validate_registration.php?SNCNum=${sncNumber}`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${process.env.NURSING_COUNCIL_TOKEN}`,
            },
        });

        //console.log('Response:', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            // Server responded with a non-2xx status
            console.error('API error:', error.response.status, error.response.data);
        } else {
            console.error('Network or other error:', error.message);
        }
    }
}


function cleanNurseData(data) {
    return {
        SNCNum: data.SNCNum.trim(),
        IdNum: parseFloat(data.IdNum.trim()), // Convert to number
        NurseName: data.NurseName.trim(),
        NurseSurname: data.NurseSurname.trim(),
        CadreTitle: data.CadreTitle.trim(),
        phone: data.ContactNum.trim(),
        email: data.Email.trim(),
    };
}



module.exports.verifyUser2 = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    const payload = req.body;

    try {

        // call nursing council API to verify user.
        const nursingCouncilResponse = await validateRegistration(payload.ENC_number);
        console.log('Nursing Council Response:', nursingCouncilResponse);
        if (!nursingCouncilResponse || nursingCouncilResponse.error) {
            return res.status(400).json({ error: 'Invalid ENC number or user not found under ENC records. Please check and try again.' });
        }
        const cleanedData = cleanNurseData(nursingCouncilResponse);


        res.status(201).json({
            message: 'User verified successfully',
            data: {
                first_name: cleanedData.NurseName,
                last_name: cleanedData.NurseSurname,
                cadre_title: cleanedData.CadreTitle,
                ENC_number: payload.ENC_number,
                national_id: cleanedData.IdNum.toString(),
                phone: cleanedData.phone || null, // Optional, can be null
                email: cleanedData.email || null, // Optional, can be null
                address: cleanedData.address || null, // Optional, can be null
                region: cleanedData.region || null, // Optional, can be null
                gender: cleanedData.gender || null, // Optional, can be null
                clinic: cleanedData.clinic || null // Optional, can be null         
            }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}