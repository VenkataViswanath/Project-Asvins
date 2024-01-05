const express = require("express");
const router = express.Router();
const {protect, authorize} = require('../middleware/auth');

const { 
    forgotpassword,
    resetPassword
} = require("../controllers/auth");

router.post('/forgotpassword', forgotpassword);
router.put('/resetpassword/:resetToken', resetPassword);

module.exports = router;