const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");
const geocoder = require('../utils/geocoder')
const crypto = require("crypto");

const DoctorSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Please add a name'],
        // maxlength: [70, 'Name cannot be more than 70 characters']
    },

    appointments: [{
        type: mongoose.Schema.Types.String,
    }],
    
    slug: String,
    
    emailid: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please enter a valid emailid'
        ]
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone number cannot be more than 20 characters']
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire:{
        type: Date
    }, 

    dob: {
        type: Date,
        required: false,
    },
    age: {
        type: Number,
        required: false,
    },
    patientsworked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
    }],
    address: {
        type: String,
        default: null,
        required: [false, 'Please add an address']
    },
    location: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: false
        },
        coordinates: {
            type: [Number],
            required: false,
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    covid19_support: {
        type: String,
        default: "no"
    },

    condition_support: {
        type: [String],
        required: false
    },

    specialization: {
        type: String,
        required: false
    },

    role: {
        type: String,
        default: "doctor"
    },

    averageRating: Number

});

// Create doctor slug from the name
DoctorSchema.pre('save', function(next){
    this.slug = slugify(this.fullname, {lower: true});
    next();
});

// Geocode and create location field
DoctorSchema.pre('save', async function(next){
    try{
        if(this.address != null){
            const loc = await geocoder.geocode(this.address);
            this.location = {
            type: 'Point',
            coordinates: [loc[0].longitude, loc[0].latitude],
            formattedAddress: loc[0].formattedAddress,
            street: loc[0].streetName,
            city: loc[0].city,
            state: loc[0].stateCode,
            zipcode: loc[0].zipcode,
            country: loc[0].countryCode
        
        }
    }
    }catch(err){
        console.log("error", err);
    }
    

    next();
});




// Encrypt password using bcryptjs
DoctorSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
DoctorSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Match user entered password to hashed password in database
DoctorSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generate and hash password token
DoctorSchema.methods.getResetPasswordToken = function() {
    // Generate the token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    // Set expire
    this.resetPasswordExpire = Date.now() + 10*60*1000;

    return resetToken;
}

module.exports = mongoose.model('Doctor', DoctorSchema);