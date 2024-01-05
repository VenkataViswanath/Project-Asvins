const express = require("express");
const router = express.Router();
const {protect, authorize} = require('../middleware/auth');
const Review = require('../models/Review');
const { 
    getDoctors,
    getDoctor,
    createDoctor,
    loginDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorsInRadius,
    getPatientsWorked,
    doctorPhotoUpload,
    getDoctorReview,
    addDoctorReview,
    getdoctorAppointments,
    postdoctorAppointment
} = require("../controllers/doctors");



router.route('/')
    .get(getDoctors)

router.route('/:doctorId/patientsworked')
    .get(protect, authorize('doctor'), getPatientsWorked)

router.route('/:doctorId/doctorAppointments')
    .get(getdoctorAppointments)

router.route('/doctorAppointment')
    .post(postdoctorAppointment)

router.route('/createDoctor')
    .post(createDoctor)

router.route('/loginDoctor')
    .post(loginDoctor)

router.route('/:id')
    .get(getDoctor)
    .put(protect, authorize('doctor'), updateDoctor)
    .delete(protect, authorize('doctor'), deleteDoctor)

router.route('/:id/reviews')
    .get(getDoctorReview)
      
router.route('/:id/reviews')
    .post(protect, authorize('patient'), addDoctorReview)

router.route('/radius/:zipcode/:distance')
      .get(getDoctorsInRadius)

router.route('/:id/photo')
      .put(protect, authorize('doctor'),doctorPhotoUpload)
            
module.exports = router;