const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const InterestSchema = new Schema ({
    name: {
        type: String,
        unique: true,
        required: true
    },
}, {timestamps: true}) // created at and updated at timestamps


module.exports = mongoose.model('interests', InterestSchema);
