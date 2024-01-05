const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");
const geocoder = require('../utils/geocoder');
const crypto = require("crypto");
const insurancePackages = require('../models/InsurancePackages');
const Patient = require('../models/patient');


const InsuranceProviderSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Please add a name'],
        // maxlength: [70, 'Name cannot be more than 70 characters']
    },

    
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
        required: [false, 'Please add an address']
    },
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
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

    role: {
        type: String,
        default: "insuranceprovider"
    },

    //insurancePackage: {
    //    type: Object,
    //    default: insurancePackages[Math.floor(Math.random() * 4)], 
    //  }

    insurancePackage: {
        type: Object,
        default: undefined,
      }

});

// Fill the patients worked array with the details of the patients.


// Update the insurance package for the Insurance Provider
InsuranceProviderSchema.pre('save', function (next) {
    if (!this.insurancePackage) {
      const randomIndex = Math.floor(Math.random() * 4);
      this.insurancePackage = insurancePackages[randomIndex];
    }
    next();
  });

// Create InsuranceProvider slug from the name
InsuranceProviderSchema.pre('save', function(next){
    this.slug = slugify(this.fullname, {lower: true});
    next();
});

// Geocode and create location field
InsuranceProviderSchema.pre('save', async function(next){
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
InsuranceProviderSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


InsuranceProviderSchema.post('save', async function (doc) {
    try {
      // Find patients with the same insurance package
      const patientsWithSamePackage = await Patient.find({
        'insurancePackage._id': doc.insurancePackage._id,
      });
  
      // Update the insurance provider's patientsworked array
      const patientIds = patientsWithSamePackage.map(patient => patient._id);
      
      // Update the patientsworked array without triggering another save event
      await this.constructor.updateOne({ _id: doc._id }, { $set: { patientsworked: patientIds } });
  
      console.log('Patientsworked updated:', patientIds);
    } catch (err) {
      console.error('Error updating patientsworked:', err);
    }
  });
  
  
  

// Sign JWT and return
InsuranceProviderSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Match user entered password to hashed password in database
InsuranceProviderSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generate and hash password token
InsuranceProviderSchema.methods.getResetPasswordToken = function() {
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

module.exports = mongoose.model('InsuranceProvider', InsuranceProviderSchema);