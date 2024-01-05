const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const InsuranceProvider = require('../models/InsuranceProvider');

// Protect routes
exports.protect = asyncHandler(async(req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    else if(req.cookies.token){
        token = req.cookies.token
    }

    if(!token){
        return res.status(401).json({success: false, message: 'Not authorized to access this route'});
    }

    try{
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);

        const doc = await Doctor.findById(decoded.id);
        if(doc){
            req.user = doc;
            // console.log('I am a doctor');
        }
        else{
            const pat = await Patient.findById(decoded.id);
            if(pat){
                req.user = pat;
                // console.log('I am a patient');
            }
            else{
                req.user = await InsuranceProvider.findById(decoded.id);
                // console.log('I am an insurance provider');
            }
        }
        next();
    } catch(err) {
        return res.status(401).json({success: false, message: 'Not authorized to access this route'});
    }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({success: false, message: `The user with the current role:${req.user.role} is not authorized to commit this action`});
        }

        next();
    }
}

