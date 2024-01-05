const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const InsuranceProvider = require('../models/InsuranceProvider');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail')

// @desc        Forgot Password
// @Route       POST /api/v1/auth/forgotpassword
// @Access      Public
exports.forgotpassword = asyncHandler(async (req, res, next) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    
    const doc = await Doctor.findOne({emailid: req.body.emailid});
    if(doc){
        // console.log('I am a doctor');
        const resetToken = doc.getResetPasswordToken();
        await doc.save({validateBeforeSave: false});

        // Create reset url
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

        try{
            const msg = {
                to: doc.emailid, 
                from: 'cvviswa7@gmail.com', 
                subject: 'Password Reset token',
                text: `You are receiving this email because you requested to reset the password. Please make a PUT request to: \n\n ${resetUrl}`
              }
              sgMail
                .send(msg)
                .then(() => {
                  console.log('Email sent')
                })
                .catch((error) => {
                  console.error(error)
                  console.error(error.response.body)
                })

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch(err){
            console.log(err);
            console.error(err.response.body);
            doc.resetPasswordToken = undefined;
            doc.resetPasswordExpire = undefined;

            await doc.save({validateBeforeSave: false});

            return res.status(500).json({success: false, message: 'Email could not be sent'}); 
        }

        // res.status(200).json({ success: true, data: doc });
    }   
    else{
        const pat = await Patient.findOne({emailid: req.body.emailid});
        if(pat){
            // console.log('I am a patient');
            const resetToken = pat.getResetPasswordToken();
            await pat.save({validateBeforeSave: false});

            // Create reset url
            const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

            try{
                const msg = {
                    to: pat.emailid, 
                    from: 'cvviswa7@gmail.com', 
                    subject: 'Password Reset token',
                    text: `You are receiving this email because you requested to reset the password. Please make a PUT request to: \n\n ${resetUrl}`
                  }
                  sgMail
                    .send(msg)
                    .then(() => {
                      console.log('Email sent')
                    })
                    .catch((error) => {
                      console.error(error)
                      console.error(error.response.body)
                    })

                res.status(200).json({ success: true, data: 'Email sent' });
            } catch(err){
                console.log(err);
                pat.resetPasswordToken = undefined;
                pat.resetPasswordExpire = undefined;

                await pat.save({validateBeforeSave: false});

                return res.status(500).json({success: false, message: 'Email could not be sent'}); 
            }
            // res.status(200).json({ success: true, data: pat });
        }
        else{
            const inspro = await InsuranceProvider.findOne({emailid: req.body.emailid});
            if(inspro){
                // console.log('I am an InsuranceProvider');
                const resetToken = inspro.getResetPasswordToken();
                await inspro.save({validateBeforeSave: false});

                // Create reset url
                const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

                try{
                    const msg = {
                        to: inspro.emailid, 
                        from: 'cvviswa7@gmail.com', 
                        subject: 'Password Reset token',
                        text: `You are receiving this email because you requested to reset the password. Please make a PUT request to: \n\n ${resetUrl}`
                      }
                      sgMail
                        .send(msg)
                        .then(() => {
                          console.log('Email sent')
                        })
                        .catch((error) => {
                          console.error(error)
                          console.error(error.response.body)
                        })

                    res.status(200).json({ success: true, data: 'Email sent' });
                } catch(err){
                    console.log(err);
                    inspro.resetPasswordToken = undefined;
                    inspro.resetPasswordExpire = undefined;

                    await inspro.save({validateBeforeSave: false});

                    return res.status(500).json({success: false, message: 'Email could not be sent'}); 
                }

                // res.status(200).json({ success: true, data: inspro });
            }
            else{
                return res.status(404).json({success: false, message: `There is no doctor, patient or insurance provider with the provided emailid`});
            }
        }
    } 
});


// @desc        Reset Password
// @Route       PUT /api/v1/auth/resetpassword/:resettoken
// @Access      Public

exports.resetPassword = asyncHandler(async(req, res, next) => {
    // Get hashed token.
    const resetPasswordToken = crypto
                            .createHash('sha256')
                            .update(req.params.resetToken)
                            .digest('hex');

    const doc = await Doctor.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()} 
    });

    if(doc){
        // Set password for doctor
        doc.password = req.body.password;
        doc.resetPasswordToken = undefined;
        doc.resetPasswordExpire = undefined;
        await doc.save();
        console.log("Doctor Password Updated");

        sendTokenResponseDoctor(doc, 200, res);
    }

    else{
        const pat = await Patient.findOne({
            resetPasswordToken,
            resetPasswordExpire: {$gt: Date.now()} 
        });

        if(pat){
            // Set password for patient
            pat.password = req.body.password;
            pat.resetPasswordToken = undefined;
            pat.resetPasswordExpire = undefined;
            await pat.save();
            console.log("Patient Password Updated");

            sendTokenResponseDoctor(pat, 200, res);
        }

        else{
            const inspro = await InsuranceProvider.findOne({
                resetPasswordToken,
                resetPasswordExpire: {$gt: Date.now()} 
            }); 

            if(inspro){
                // Set password for insurance provider
                inspro.password = req.body.password;
                inspro.resetPasswordToken = undefined;
                inspro.resetPasswordExpire = undefined;
                await inspro.save();
                console.log("Insurance Provider Password Updated");

                sendTokenResponseDoctor(inspro, 200, res);
            }

            else{
                return res.status(404).json({success: false, message: `There is no doctor, patient or insurance provider with the provided token`});
            }
        }
    }

})


// Get token from model, create cookie and send response.
const sendTokenResponseDoctor = (doctor, statusCode, res) => {
    // Create Token
    const token = doctor.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    options.secure = true;

    res.status(statusCode)
       .cookie('token', token, options)
       .json({
        success: true,
        token
       });
};

// Get token from model, create cookie and send response.
const sendTokenResponsePatient = (patient, statusCode, res) => {
    // Create Token
    const token = patient.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    options.secure = true;

    res.status(statusCode)
       .cookie('token', token, options)
       .json({
        success: true,
        token
       });
};


// Get token from model, create cookie and send response.
const sendTokenResponseInsuranceProvider = (insuranceprovider, statusCode, res) => {
    // Create Token
    const token = insuranceprovider.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    options.secure = true;

    res.status(statusCode)
       .cookie('token', token, options)
       .json({
        success: true,
        token
       });
};