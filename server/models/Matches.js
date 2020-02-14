const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const MatchesSchema = new Schema ({
	user1: {type: Schema.Types.ObjectId, ref: 'users'},
    user2: {type: Schema.Types.ObjectId, ref: 'users'},
    messages: [{type: Schema.Types.ObjectId, ref: 'messages'}]
}, {timestamps: true}) // created at and updated at timestamps

module.exports = mongoose.model('matches', MatchesSchema);
