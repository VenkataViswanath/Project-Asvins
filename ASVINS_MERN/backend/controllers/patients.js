const Patient = require('../models/patient');
const asyncHandler = require('../middleware/async');
const path = require('path');
const Doctor = require('../models/doctor');
const insurancePackages = require('../models/InsurancePackages');


// @desc        GET all patients
// @Route       GET /api/v1/patients
// @Access      Private
exports.getPatients = async (req, res, next) => {
    try {
        const patients = await Patient.find();
        res
        .status(200)
        .json({success: true, count: patients.length, data: patients});
        } 
        
        catch (error) {
            res.status(400).json({success: false});
        }
}


// @desc        GET all doctors worked with a patient
// @Route       GET /api/v1/patients/:patientId/doctorsworked
// @Access      Private
exports.getDoctorsWorked = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.patientId);
        if (!patient) {
            return res.status(404).json({ success: false, error: 'Patient not found' });
        }

        // Add new Doctor IDs to the patient's doctorsworked field
        // patient.doctorsworked.push("652f06ceec4c3ea9cdda6629"); // Replace with actual doctor IDs

        // Save the updated patient document
        // await patient.save();

        // Retrieve doctor data based on the doctor IDs in the doctorsworked field
        const doctors = await Doctor.find({ _id: { $in: patient.doctorsworked } });
        res.status(200).json({ success: true, count: doctors.length, data: doctors });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}

// @desc        GET all patient appointments
// @Route       GET /api/v1/doctors/:patientId/patientAppointments
// @Access      Private
exports.getpatientAppointments = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.patientId);
        if (!patient) {
            return res.status(404).json({ success: false, error: 'Patient not found' });
        }

        const appointments = patient.appointments;

        res.status(200).json({ success: true, data: appointments });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


// @desc        GET a single patient
// @Route       GET /api/v1/patients
// @Access      Private
exports.getPatient = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);
         
        if(!patient){
            //console.log("Wrong ID");
            return res.status(400).json({success: false});
        }

        res
        .status(200)
        .json({success: true, data: patient});
        } 
        
        catch (error) {
            res.status(400).json({success: false});
        }
}


// @desc        CREATE/Register Patient
// @Route       POST /api/v1/patients/createPatient
// @Access      Private
exports.createPatient = async (req, res, next) => {
    try {
    const patient = await Patient.create(req.body);
 
    if(!patient){
        //console.log("Wrong ID");
        return res.status(400).json({success: false});
    }

    sendTokenResponse(patient, 200, res); 
    } 
    
    catch (error) {
        res.status(400).json({success: false, data: 'Patient with same email already exists.'});
    }
    
}


// @desc        LOGIN patient
// @Route       POST /api/v1/patients/loginPatient
// @Access      Private
exports.loginPatient = async (req, res, next) => {
    try {
    const {emailid, password} = req.body;

    if(!emailid || !password) {
        //console.log("Wrong email or password");
        return res.status(400).json({success: false, message: 'Please provide both email and password'});
    }

    // check for patient
    const patient = await Patient.findOne({emailid}).select('+password'); 

    if(!patient) {
        return res.status(401).json({success: false, message: '401: Invalid Credentials'});
    }

    // check for password match
    const isMatch = await patient.matchPassword(password);
    if(!isMatch) {
        return res.status(401).json({success: false, message: '401: Invalid Credentials'});
    }

    sendTokenResponse(patient, 200, res); 
    } 
    
    catch (error) {
        res.status(400).json({success: false, data: 'Patient with same email already exists.'});
    }
    
}


// @desc        Update a patient
// @Route       PUT /api/v1/patients
// @Access      Private
exports.updatePatient = async (req, res, next) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!patient){
            //console.log("Wrong ID");
            return res.status(400).json({success: false});
        }

        res
        .status(200)
        .json({success: true, data: patient});
        } 
        
        catch (error) {
            res.status(400).json({success: false});
        }
}

    
// @desc        Delete a patient
// @Route       DELETE /api/v1/patients/id
// @Access      Private
exports.deletePatient = async (req, res, next) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);

        if(!patient){
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


// @desc        Upload photo for Patient
// @Route       PUT /api/v1/patients/:id/photo
// @Access      Private
exports.patientPhotoUpload = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if(!patient){
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
        file.name = `photo_${patient._id}${path.parse(file.name).ext}`;
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
            if(err){
                console.error(err);
                return res.status(500).json({success:false, message: 'Problem with file upload'});
            }

            await Patient.findByIdAndUpdate(req.params.id, {photo: file.name});
            res.status(200).json({success: true, data:file.name});
        });
        } 
        
        catch (error) {
            res.status(400).json({success: false});
        }
}   


// @desc        Update the insurance package for a patient
// @Route       PUT /api/v1/patients/:id/updateInsurancePackage
// @Access      Private

exports.updateInsurancePackage = async (req, res, next) => {
  const { patientId, selectedPackageId } = req.body;

  try {
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    if (!(selectedPackageId in insurancePackages)) {
      return res.status(400).json({ success: false, message: 'Invalid selected package ID' });
    }

    patient.insurancePackage = insurancePackages[selectedPackageId];
    await patient.save();

    return res.status(200).json({ success: true, message: 'Insurance package updated successfully', patient });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// @desc        GET all the insurance packages
// @Route       PUT /api/v1/patients/getAllInsurancePackages
// @Access      Public
exports.getAllInsurancePackages = async (req, res, next) => {
    try {
        return res.status(200).json({ success: true, data: insurancePackages });
      } 
      
      catch (err) { 
        return res.status(500).json({ success: false, error: 'Server Error' });
      }
}



// Get token from model, create cookie and send response.
const sendTokenResponse = (patient, statusCode, res) => {
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
        data: patient,
        token
       });
};