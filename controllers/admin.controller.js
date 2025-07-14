const { AdminModel } = require('../models');
const {validationResult} = require('express-validator');

module.exports.registerAdmin = async (req, res, next) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()});
    }

    const {email, password, name} = req.body;

    const isAdminExist = await AdminModel.findOne({ where: { email } });
    if(isAdminExist){
        return res.status(400).json({error: 'Admin already exist'});
    }


    const hashedPassword = await AdminModel.hashPassword(password.toString());
    const admin = await AdminModel.create({
        email,
        password: hashedPassword,
        name: name,
    });

    res.status(201).json(admin);
}


module.exports.loginAdmin = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    const { email, password } = req.body;


    const admin = await AdminModel.findOne({ where: {email}, attributes: ['id', 'email', 'password', 'name'],});
    if (!admin) {
        return res.status(400).json({ error: 'Invalid email or password 1' });
    }

    const isMatch = await admin.comparePassword(password); 
    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password 2' });
    }

    const token = await admin.generateAuthToken(); // ✅ instance method

    res.status(200).json({ admin, token });
};


module.exports.logout = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({error: 'Unauthorized'});
    }
    await AdminModel.update(
        { token: '' },   
        { where: { token: token }}  
    );
    res.status(200).json({message: 'Logout successfully'});
}