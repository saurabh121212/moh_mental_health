const BaseRepo = require('../services/BaseRepository');
const { UserModel } = require('../models');
const { validationResult } = require('express-validator');
const { encrypt, decrypt, encryptEmailForLogin } = require('../utils/crypto');
const sendEmail = require('../mailer/mailerFile');



module.exports.registerUser = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    const payload = req.body;

    // converting string password to hash password
    const hashedPassword = await UserModel.hashPassword(payload.password.toString());

    // Check if the user already exists
    //const loginKey1 = encryptEmailForLogin(payload.email, process.env.ENCRYPTION_KEY);
    const existingUser = await UserModel.findOne({ where: { email: payload.email } });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists With this Email ID' });
    }


    // Encrypt sensitive data
    // const encFirstName = encrypt(payload.first_name);
    // const encFirstNameiv = encFirstName.iv;
    // const encFirstNameauthTag = encFirstName.authTag;

    // const encLastName = encrypt(payload.last_name);
    // const encLastNameiv = encLastName.iv;
    // const encLastNameauthTag = encLastName.authTag;

    // const encPhone = encrypt(payload.phone);
    // const encPhoneiv = encPhone.iv;
    // const encPhoneauthTag = encPhone.authTag;

    // const encEmail = encrypt(payload.email);
    // const encEmailiv = encEmail.iv;
    // const encEmailauthTag = encEmail.authTag;


    // Store the login key in the database
    //const loginKey = encryptEmailForLogin(payload.email, process.env.ENCRYPTION_KEY);

    // Generate a random username based on the first name
    const username = generateRandomUsername(payload.first_name);

    try {
        const user = await UserModel.create({
            first_name: payload.first_name,
            // first_name_iv: encFirstNameiv,
            // first_name_auth_tag: encFirstNameauthTag,

            last_name: payload.last_name,
            // last_name_iv: encLastNameiv,
            // last_name_auth_tag: encLastNameauthTag,

            phone: payload.phone,
            // phone_iv: encPhoneiv,
            // phone_auth_tag: encPhoneauthTag,

            email: payload.email,
            // email_iv: encEmailiv,
            // email_auth_tag: encEmailauthTag,
            
            national_id: payload.national_id,
            ENC_number: payload.ENC_number,
            password: hashedPassword,
            // email_login_key: loginKey,
            alias_name: payload.alias_name,
            system_generated_name: username,
            gender: payload.gender,
            region: payload.region,
            address: payload.address,
            clinic: payload.clinic,
            cadre: payload.cadre,
            password: hashedPassword,
            device_id: payload.device_id,
            device_type: payload.device_type,
            device_token: payload.device_token
        });

        if (!user) {
            return res.status(400).json({ error: 'User Not Registered' });
        }

        const token = await user.generateAuthToken(); // ✅ instance method
        res.status(201).json({
            message: 'User Registered successfully',
            data: user,
            token: token
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports.loginUser = async (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    const { email, password, device_id, device_type, device_token } = req.body;

    //const loginKey = encryptEmailForLogin(email, process.env.ENCRYPTION_KEY);

    const user = await UserModel.findOne({ where: { email: email } });
    if (!user) {
        return res.status(400).json({ error: 'Please check your email and password and try again.' });
    }

    // console.log("user 1", user);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Please check your email and password and try again.' });
    }

    // console.log("user id ", user.dataValues.id);
    const id = user.dataValues.id;
    const token = await user.generateAuthToken(); //  instance method

    // Update device information
    await BaseRepo.baseUpdate(UserModel, { id }, { device_id, device_type, device_token });

    // const first_name = decrypt(user.dataValues.first_name, user.dataValues.first_name_iv, user.dataValues.first_name_auth_tag);
    // const last_name = decrypt(user.dataValues.last_name, user.dataValues.last_name_iv, user.dataValues.last_name_auth_tag);
    // const phone = decrypt(user.dataValues.phone, user.dataValues.phone_iv, user.dataValues.phone_auth_tag);
    // const emailId = decrypt(user.dataValues.email, user.dataValues.email_iv, user.dataValues.email_auth_tag);
   
    const first_name = user.dataValues.first_name;
    const last_name = user.dataValues.last_name;
    const phone = user.dataValues.phone;
    const emailId = user.dataValues.email;

    const national_id = user.dataValues.national_id;
    const ENC_number = user.dataValues.ENC_number;


    res.status(200).json({
        message: 'User logged in successfully',
        data: {
            first_name, last_name, phone, email: emailId,
            national_id,
            ENC_number,
            alias_name: user.dataValues.alias_name,
            system_generated_name: user.dataValues.system_generated_name,
            gender: user.dataValues.gender,
            region: user.dataValues.region,
            address: user.dataValues.address,
            clinic: user.dataValues.clinic,
            cadre: user.dataValues.cadre,
            id: user.dataValues.id,
        }, token
    });
};


module.exports.sendOTPEmailVerification = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    const { email, otp } = req.body;
    try {
        // const loginKey = encryptEmailForLogin(email, process.env.ENCRYPTION_KEY);
        const isEmailExist = await UserModel.findOne({ where: { email: email } });
        if (isEmailExist) {
            res.status(201).json({ message: 'User with this email is already registered please use a different email' });
        }
        // write send otp code here on email Id
        sendEmail(otp, 6, email);
        res.status(201).json({ message: 'OTP sent successfully to your email' });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports.sendOTPForgetPassword = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    const { email, otp } = req.body;
    try {
      //  const loginKey = encryptEmailForLogin(email, process.env.ENCRYPTION_KEY);
        const isEmailExist = await UserModel.findOne({ where: { email: email } });
        if (isEmailExist) {
            sendEmail(otp, 1, email);
            res.status(201).json({ message: 'OTP sent successfully to your email' });
        }
        // write send otp code here on email Id
        res.status(201).json({ message: 'This email is not registered with us' });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports.forgetPassword = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    const password = req.body.password;
    const email = req.params.email;

    console.log("password", password.toString());
    const hashedPassword = await UserModel.hashPassword(password.toString());

    console.log("hashedPassword", hashedPassword);
    // const loginKey = encryptEmailForLogin(email, process.env.ENCRYPTION_KEY);
    const user = await BaseRepo.baseUpdate(UserModel, { email: email }, { password: hashedPassword });
    if (!user) {
        return res.status(400).json({ error: 'Error Updating User Password' });
    }
    res.status(201).json({
        message: 'updated user Password successfully',
        data: user
    });
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

        const first_name =user.dataValues.first_name;
        const last_name = user.dataValues.last_name;
        const phone = user.dataValues.phone;
        const emailId = user.dataValues.email;
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
        // attributes : ['id','alias_name', 'system_generated_name','gender', 'region', 'address', 'clinic', 'cadre']
    }
    try {
        const result = await BaseRepo.baseList(UserModel, params);

        if (!result?.values?.rows || result.values.rows.length === 0) {
            return res.status(400).json({ error: 'No users found' });
        }

        const users = result.values.rows;

        const decryptedUsers = users.map(user => {
            return {
                first_name: user.dataValues.first_name,
                last_name: user.dataValues.last_name,
                phone: user.dataValues.phone,
                email: user.dataValues.email,
                national_id: user.dataValues.national_id,
                ENC_number: user.dataValues.ENC_number,
                alias_name: user.dataValues.alias_name,
                gender: user.dataValues.gender,
                region: user.dataValues.region,
                address: user.dataValues.address,
                clinic: user.dataValues.clinic,
                cadre: user.dataValues.cadre,
            };
        });

        res.status(200).json({
            message: 'Users fetched successfully',
            data: decryptedUsers,
            page: result.page,
            limit: result.limit,
            total_pages: result.total_pages,
            total: result.total

        });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}



module.exports.getUserById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const result = await BaseRepo.baseFindById(UserModel, id, "id");

        if (!result) {
            return res.status(400).json({ error: 'No users found' });
        }
        res.status(200).json({
            message: 'Users fetched successfully',
            data: result,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.update = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const payload = req.body;
  const id = req.params.id;

  try {
    const encFirstName = payload.first_name;
    const encLastName = payload.last_name;
    const encPhone = payload.phone;
    const encEmail = payload.email;

    const UpdateValues = {
      first_name: encFirstName,
    //   first_name_iv: encFirstName.iv,
    //   first_name_auth_tag: encFirstName.authTag,

      last_name: encLastName,
    //   last_name_iv: encLastName.iv,
    //   last_name_auth_tag: encLastName.authTag,

      phone: encPhone,
    //   phone_iv: encPhone.iv,
    //   phone_auth_tag: encPhone.authTag,

      email: encEmail,
    //   email_iv: encEmail.iv,
    //   email_auth_tag: encEmail.authTag,
      gender: payload.gender,
      region: payload.region,
      address: payload.address,
      clinic: payload.clinic,
      cadre: payload.cadre
    };

    const [updatedCount] = await UserModel.update(UpdateValues, { where: { id } });

    if (updatedCount === 0) {
      return res.status(400).json({ error: 'User not found or no changes made' });
    }

    const userValues = await UserModel.findByPk(id);

    res.status(200).json({
      message: 'User updated successfully',
      data: userValues
    });
  } catch (err) {
    console.error('❌ Update Error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.delete = async (req, res, next) => {

    const id = req.params.id;

    try {
        const data = await BaseRepo.baseDelete(FAQModel, { id });
        if (!data) {
            return res.status(400).json({ error: 'Error deleting FAQs' });
        }
        res.status(201).json({
            message: 'FAQs deleted successfully',
            data: data
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


// this function generates a random username based on the user's name
// It takes the first two letters of the name and appends a random 6-digit number
function generateRandomUsername(name) {
    const prefix = name.slice(0, 2).toLowerCase(); // Take first 2 letters
    const randomDigits = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit number
    return `${prefix}${randomDigits}`;
}


