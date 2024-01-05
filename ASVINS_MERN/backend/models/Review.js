const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a name'],
        maxlength: 100
    },
    
    text: {
        type: String,
        required: [true, 'Please add some text'],
    },

    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 and 10']
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },

    doctor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Doctor',
        required: true
    },

    patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient',
        required: true
    },

});

// Prevent patient from submitting more than one review per doctor.
ReviewSchema.index({patient: 1, doctor: 1}, {unique: true});

// Static method to get the average rating and save
ReviewSchema.statics.getAverageRating = async function(id) {
    const obj = await this.aggregate([
        {
            $match: {doctor: id}
        },
        {
            $group: {
                _id: '$doctor',
                averageRating: {$avg: '$rating'}
            }
        }
    ]);

    try{
        await this.model('Doctor').findByIdAndUpdate(id, {
            averageRating: obj[0].averageRating
        });
    } 
    catch(err){
        console.log(err);
    }
}


// Call getAverageRating after save
ReviewSchema.post('save', function(){
    this.constructor.getAverageRating(this.doctor);
});

// Call getAverageRating after remove
ReviewSchema.pre('remove', function(){
    this.constructor.getAverageRating(this.doctor);
});


module.exports = mongoose.model('Review', ReviewSchema);