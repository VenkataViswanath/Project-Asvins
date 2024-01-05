const express = require("express");
const router = express.Router();
const {protect, authorize} = require('../middleware/auth');
const { 
    getPatients,
    getPatient,
    getDoctorsWorked,
    createPatient,
    loginPatient,
    updatePatient,
    deletePatient,
    patientPhotoUpload,
    getpatientAppointments,
    updateInsurancePackage,
    getAllInsurancePackages
} = require("../controllers/patients");



// router.route('/')
//     .get(protect, authorize('doctor'), getPatients)

router.route('/getAllInsurancePackages')
    .get(getAllInsurancePackages)

router.route('/:patientId/doctorsworked')
    .get(protect, authorize('patient'), getDoctorsWorked)

router.route('/createPatient')
    .post(createPatient)

router.route('/loginPatient')
    .post(loginPatient)

router.route('/:patientId/patientAppointments')
    .get(protect, authorize('patient'), getpatientAppointments)

router.route('/:id')
    .get(protect, authorize('doctor'), getPatient)
    .put(protect, authorize('patient'), updatePatient)
    .delete(protect, authorize('patient'), deletePatient)
      
router.route('/:id/photo')
    .put(protect, authorize('patient'), patientPhotoUpload)

router.route('/:patientId/updateInsurancePackage')
    .put(protect, authorize('patient'), updateInsurancePackage)
            
module.exports = router;