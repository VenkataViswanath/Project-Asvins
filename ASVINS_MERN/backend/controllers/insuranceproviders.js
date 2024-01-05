const InsuranceProvider = require('../models/InsuranceProvider');
const asyncHandler = require('../middleware/async');
const path = require('path');
const insurancePackages = require('../models/InsurancePackages');


// @desc        GET all insuranceproviders
// @Route       GET /api/v1/insuranceproviders
// @Access      Public
exports.getInsuranceProviders = async (req, res, next) => {
    try {
        const insuranceproviders = await InsuranceProvider.find();
        res
        .status(200)
        .json({success: true, count: insuranceproviders.length, data: insuranceproviders});
        } 
        
        catch (error) {
            res.status(400).json({success: false});
        }
}


// @desc        GET all insuranceproviders
// @Route       GET /api/v1/insuranceproviders
// @Access      Private
exports.getInsuranceProvider = async (req, res, next) => {
    try {
        const insuranceprovider = await InsuranceProvider.findById(req.params.id);
         
        if(!insuranceprovider){
            //console.log("Wrong ID");
            return res.status(400).json({success: false});
        }

        res
        .status(200)
        .json({success: true, data: insuranceprovider});
        } 
        
        catch (error) {
            res.status(400).json({success: false});
        }
}


// @desc        CREATE/Register InsuranceProvider
// @Route       POST /api/v1/insuranceproviders/createInsuranceProvider
// @Access      Private
exports.createInsuranceProvider = async (req, res, next) => {
    try {
        const insuranceprovider = await InsuranceProvider.create(req.body);
 
        if(!insuranceprovider){
            return res.status(400).json({success: false});
    }

        sendTokenResponse(insuranceprovider, 200, res); 

    } 
    
    catch (error) {
        console.log(error);
        res.status(400).json({success: false, data: 'InsuranceProvider with same email already exists.'});
    }
    
}


// @desc        LOGIN insuranceprovider
// @Route       POST /api/v1/insuranceproviders/loginInsuranceProvider
// @Access      Private
exports.loginInsuranceProvider = async (req, res, next) => {
    try {
    const {emailid, password} = req.body;

    if(!emailid || !password) {
        //console.log("Wrong email or password");
        return res.status(400).json({success: false, message: 'Please provide both email and password'});
    }

    // check for insuranceprovider
    const insuranceprovider = await InsuranceProvider.findOne({emailid}).select('+password'); 

    if(!insuranceprovider) {
        return res.status(401).json({success: false, message: '401: Invalid Credentials'});
    }

    // check for password match
    const isMatch = await insuranceprovider.matchPassword(password);
    if(!isMatch) {
        return res.status(401).json({success: false, message: '401: Invalid Credentials'});
    }

    sendTokenResponse(insuranceprovider, 200, res); 

    } 
    
    catch (error) {
        res.status(400).json({success: false, data: 'InsuranceProvider with same email already exists.'});
    }
    
}


// @desc        Update a insuranceprovider
// @Route       PUT /api/v1/insuranceproviders/id
// @Access      Private
exports.updateInsuranceProvider = async (req, res, next) => {
    try {
        const insuranceprovider = await InsuranceProvider.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!insuranceprovider){
            //console.log("Wrong ID");
            return res.status(400).json({success: false});
        }

        res
        .status(200)
        .json({success: true, data: insuranceprovider});
        } 
        
        catch (error) {
            res.status(400).json({success: false});
        }
}

    
// @desc        Delete a insuranceprovider
// @Route       DELETE /api/v1/insuranceproviders/id
// @Access      Private
exports.deleteInsuranceProvider = async (req, res, next) => {
    try {
        const insuranceprovider = await InsuranceProvider.findByIdAndDelete(req.params.id);

        if(!insuranceprovider){
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


// @desc        Upload photo for InsuranceProvider
// @Route       PUT /api/v1/insuranceproviders/:id/photo
// @Access      Private
exports.insuranceproviderPhotoUpload = async (req, res, next) => {
    try {
        const insuranceprovider = await InsuranceProvider.findById(req.params.id);

        if(!insuranceprovider){
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
        file.name = `photo_${insuranceprovider._id}${path.parse(file.name).ext}`;
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
            if(err){
                console.error(err);
                return res.status(500).json({success:false, message: 'Problem with file upload'});
            }

            await InsuranceProvider.findByIdAndUpdate(req.params.id, {photo: file.name});
            res.status(200).json({success: true, data:file.name});
        });
        } 
        
        catch (error) {
            res.status(400).json({success: false});
        }
}   



// Get token from model, create cookie and send response.
const sendTokenResponse = (insuranceprovider, statusCode, res) => {
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
        data: insuranceprovider,
        token
       });
};