const Doctor = require('../models/doctor');
const Review = require('../models/Review');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const path = require('path');
const Patient = require('../models/patient');
const sgMail = require('@sendgrid/mail');

// @desc        GET all doctors
// @Route       GET /api/v1/doctors
// @Access      Private

/*
exports.getDoctors = async (req, res, next) => {
    try {
        let query;

        let queryStr = JSON.stringify(req.query);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        queryStr = JSON.parse(queryStr);
        // console.log(queryStr);
        query = Doctor.find(queryStr);

        const doctors = await query;

        res
        .status(200)
        .json({success: true, count: doctors.length, data: doctors});
        } 
        
        catch (error) {
            res.status(400).json({success: false});
        }
}
*/

exports.getDoctors = async (req, res, next) => {
    try {
        const { fullname, specialization, condition_support, covid19_support } = req.query;
        let query = {};

        if (fullname) {
            // Search by name, case-insensitive
            query.fullname = { $regex: new RegExp(fullname, 'i') };
        }

        if (specialization) {
            // Search by specialization
            query.specialization = { $regex: new RegExp(specialization, 'i') };;
        }

        if (condition_support) {
            // Search by condition_support list
            query.condition_support = { $in: condition_support };
        }

        if (covid19_support) {
            // Search by specialization
            query.covid19_support = covid19_support;
        }

        const doctors = await Doctor.find(query);

        res.status(200).json({ success: true, count: doctors.length, data: doctors });
    } catch (error) {
        res.status(400).json({ success: false });
    }
}



// @desc        GET a single doctor
// @Route       GET /api/v1/doctor/id
// @Access      Private
exports.getDoctor = async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
         
        if(!doctor){
            //console.log("Wrong ID");
            return res.status(400).json({success: false});
        }

        res
        .status(200)
        .json({success: true, data: doctor});
        } 
        
        catch (error) {
            res.status(400).json({success: false});
        }
}

// @desc        GET all patients worked by a doctor
// @Route       GET /api/v1/doctors/:doctorId/patientsworked
// @Access      Private
exports.getPatientsWorked = async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        }

        // Add new patient IDs to the doctor's patientsworked field
        // doctor.patientsworked.push("651ce0cbd1b5f9ed93f847d1", "654b03c66831a08edcc48628"); // Replace with actual patient IDs

        // Save the updated doctor document
        //await doctor.save();

        // Retrieve patient data based on the patient IDs in the patientsworked field
        const patients = await Patient.find({ _id: { $in: doctor.patientsworked } });
        res.status(200).json({ success: true, count: patients.length, data: patients });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}

// @desc        GET all doctor appointments
// @Route       GET /api/v1/doctors/:doctorId/doctorAppointments
// @Access      Private
exports.getdoctorAppointments = async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        }

        const appointments = doctor.appointments;

        res.status(200).json({ success: true, data: appointments });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc        POST doctor appointments
// @Route       POST /api/v1/doctors/doctorAppointment
// @Access      Private

exports.postdoctorAppointment = async (req, res, next) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    try {
        const doctor = await Doctor.findById(req.body.doctorId);
        const patient = await Patient.findById(req.body.patientId);

        if (!doctor) {
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        }

        if (!patient) {
            return res.status(404).json({ success: false, error: 'Patient not found' });
        }

        const newappointment = req.body.newappointment;

        if (!doctor.appointments.includes(newappointment) && !patient.appointments.includes(newappointment)) {
            doctor.appointments.push(newappointment);
            if (!doctor.patientsworked.includes(req.body.patientId)) {
                doctor.patientsworked.push(req.body.patientId);
                patient.doctorsworked.push(req.body.doctorId);
            }
            patient.appointments.push(newappointment);

            await doctor.save();
            await patient.save();

            // console.log(doctor.appointments);
            // console.log(patient.appointments);

            const msg = {
                to: [patient.emailid, doctor.emailid], // Add more email addresses as needed
                from: 'cvviswa7@gmail.com', 
                subject: `Doctor Appointment Scheduling between ${doctor.emailid} and ${patient.emailid}`,
                text: `You are receiving this email because you requested to schedule an appointment between ${doctor.emailid} and ${patient.emailid}. The appointment is successfully scheduled at ${newappointment}`
            };

            sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent');
                })
                .catch((error) => {
                    console.error(error);
                    console.error(error.response.body);
                });

            res.status(200).json({ success: true, message: 'Email sent', data: doctor});
        } else {
            res.status(200).json({ success: false, data: 'Appointment not scheduled due to conflict. Please check your schedule and also the doctor schedule and re-book the appointment at a different time.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


// @desc        GET all reviews
// @Route       GET /api/v1/doctor/id/reviews
// @Access      Public
exports.getDoctorReview = async (req, res, next) => {

    try {
        if(req.params.id){
            const reviews = await Review.find({doctor: req.params.id});
            res
            .status(200)
            .json({success: true, count: reviews.length, data: reviews});
        }

        else{
            res.status(400).json({success: false, message: 'Send the doctor id for review.'});
        }
        } 
        
        catch (error) {
            res.status(400).json({success: false});
        }
}


// @desc        CREATE/Register Doctor
// @Route       POST /api/v1/doctors/createDoctor
// @Access      Private
exports.createDoctor = async (req, res, next) => {
    try {
        const doctor = await Doctor.create(req.body);
    
        if(!doctor){
            //console.log("Wrong ID");
            return res.status(400).json({success: false});
        }

        sendTokenResponse(doctor, 200, res); 
    }
    catch(err) {
        res.status(400).json({success: false, data: err});
    }
    
}


// @desc        LOGIN doctor
// @Route       POST /api/v1/doctors/loginDoctor
// @Access      Private
exports.loginDoctor = async (req, res, next) => {
    try {
    const {emailid, password} = req.body;

    if(!emailid || !password) {
        //console.log("Wrong email or password");
        return res.status(400).json({success: false, message: 'Please provide both email and password'});
    }

    // check for doctor
    const doctor = await Doctor.findOne({emailid}).select('+password'); 

    if(!doctor) {
        return res.status(401).json({success: false, message: '401: Invalid Credentials'});
    }

    // check for password match
    const isMatch = await doctor.matchPassword(password);
    if(!isMatch) {
        return res.status(401).json({success: false, message: '401: Invalid Credentials'});
    }

    sendTokenResponse(doctor, 200, res);
    } 
    
    catch (error) {
        res.status(400).json({success: false, data: 'Doctor with same email already exists.'});
    }
    
}


// @desc        Update a doctor
// @Route       PUT /api/v1/doctors/id
// @Access      Private

exports.updateDoctor = async (req, res, next) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!doctor){
            //console.log("Wrong ID");
            return res.status(400).json({success: false});
        }
        
        res
        .status(200)
        .json({success: true, data: doctor});
        } 
        
        catch (error) {
            res.status(400).json({success: false});
        }
    
}


// @desc        Add review
// @Route       POST /api/v1/doctor/id/reviews
// @Access      Private
exports.addDoctorReview = async (req, res, next) => {
    try {
        req.body.doctor = req.params.id;
        req.body.patient = req.user.id;

        const doctor = await Doctor.findById(req.params.id);
        if(!doctor){
            return res.status(404).json({success: false, message: 'No doctor with the id specified.'});
        }

        const review = await Review.create(req.body);
        res.status(201).json({success: true, data: review});

        } 
        
        catch (error) {
            // console.log(error);
            res.status(400).json({success: false, message: 'There exists a review already for this doctor by this user'});
        }
}


    
// @desc        Delete a doctor
// @Route       DELETE /api/v1/doctors/id
// @Access      Private
exports.deleteDoctor = async (req, res, next) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);

        if(!doctor){
            //console.log("Wrong ID");
            return res.status(400).json({success: false});
        }

        res
        .status(200)
        .json({success: true, data: {}});
        } 
        
        catch (error) {
            res.status(400).json({success: false});
        }
}   


// @desc        Get doctors within radius
// @Route       DELETE /api/v1/doctors/radius/:zipcode/:distance
// @Access      Private
exports.getDoctorsInRadius = async (req, res, next) => {
    try {
        const {zipcode, distance} = req.params;
        
        // Get latitude/longitude from geocoder
        const loc = await geocoder.geocode(zipcode);
        const lat = loc[0].latitude
        const lng = loc[0].longitude

        // Calculate radius using radians
        // Divide distance by radius of Earth
        // Earth radius = 3,963 mi

        const radius = distance/3963

        const doctors = await Doctor.find({
            location: { $geoWithin: {$centerSphere: [[lng, lat], radius]} }
        });

        res
        .status(200)
        .json({success: true, 
            count: doctors.length,
            data: doctors
        });
        } 
        
        catch (error) {
            res.status(400).json({success: false});
        }
}  


// @desc        Upload photo for Doctor
// @Route       PUT /api/v1/doctors/:id/photo
// @Access      Private
exports.doctorPhotoUpload = async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if(!doctor){
            //console.log("Wrong ID");
            return res.status(400).json({success: false});
        }

        if(!req.files){
            return res.status(400).json({success:false, message: 'Please upload a file'});
        }

        
        const file = req.files.file;
        // console.log(req.files);

        // Ensure that the image is a photo
        if(!file.mimetype.startsWith('image')){
            return res.status(400).json({success:false, message: 'Please upload an image file'});
        }

        // Check file size
        if(file.size > process.env.MAX_FILE_UPLOAD){
            return res.status(400).json({success:false, message: 'Please upload an image file less than 3MB'});
        }

        // Create custom filename
        file.name = `photo_${doctor._id}${path.parse(file.name).ext}`;
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
            if(err){
                console.error(err);
                return res.status(500).json({success:false, message: 'Problem with file upload'});
            }

            await Doctor.findByIdAndUpdate(req.params.id, {photo: file.name});
            res.status(200).json({success: true, data:file.name});
        });
        } 
        
        catch (error) {
            res.status(400).json({success: false});
        }
}   


// Get token from model, create cookie and send response.
const sendTokenResponse = (doctor, statusCode, res) => {
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
        data: doctor,
        token
       });
};

