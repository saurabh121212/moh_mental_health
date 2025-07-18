const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AdminModel, UserModel, HospitalModel } = require('../models');



module.exports.authUser = async (req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({error: 'Unauthorized Token'});
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_USER);
        const user = await UserModel.findByPk(decodedToken.id);
        if(!user){
            return res.status(401).json({error: 'Unauthorized Token '});
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({error: 'Unauthorized Token ' + error.message});
    }
}

module.exports.authAdmin = async (req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_ADMIN);

        const Admin = await AdminModel.findByPk(decodedToken.id);
        if(!Admin){
            return res.status(401).json({ error: 'Unauthorized: Admin not found' });
        }
        req.Admin = Admin;
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
}



module.exports.authHospital = async (req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_HOSPITAL);

        const Hospital = await HospitalModel.findByPk(decodedToken.id);
        if(!Hospital){
            return res.status(401).json({ error: 'Unauthorized: Hospital not found' });
        }
        req.Hospital = Hospital;
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
}