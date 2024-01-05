const express = require("express");
const router = express.Router();
const {protect, authorize} = require('../middleware/auth');
const { 
    getInsuranceProviders,
    getInsuranceProvider,
    createInsuranceProvider,
    loginInsuranceProvider,
    updateInsuranceProvider,
    deleteInsuranceProvider,
    insuranceproviderPhotoUpload
} = require("../controllers/insuranceproviders");



router.route('/')
    .get(getInsuranceProviders)

router.route('/createInsuranceProvider')
    .post(createInsuranceProvider)

router.route('/loginInsuranceProvider')
    .post(loginInsuranceProvider)

router.route('/:id')
    .get(getInsuranceProvider)
    .put(protect, authorize('insuranceprovider'), updateInsuranceProvider)
    .delete(protect, authorize('insuranceprovider'), deleteInsuranceProvider)
      
router.route('/:id/photo')
    .put(protect, authorize('insuranceprovider'), insuranceproviderPhotoUpload)
            
module.exports = router;