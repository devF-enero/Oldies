const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema ({
	name: {
		first: {type:String, required: true},
		middle: String,
		last: String
	},
	description: String,
	email: {type:String, required: true},
	password: {type: String, required: true},
	age: {type: Number, required: true, min: 18, max: 120},
	age_range: {
		min: {type: Number, default: 18} ,
		max: {type: Number, default: 120}
	},
	//location: String,	
	sex: {
		type: String,
		enum: ['M','F','TW','TM','N']
    }, // male, female, trans woman, trans man, non-binary
    interested_in: {
        type: [String],
		enum: ['M','F','TW','TM','N','A']
	},
	interests: [{type: Schema.Types.ObjectId, ref: 'interests'}],
	likes:[{type: Schema.Types.ObjectId, ref: 'users'}],
	matches:[{type: Schema.Types.ObjectId, ref: 'users'}],
	rejects:[{type: Schema.Types.ObjectId, ref: 'users'}],
	photo:[String],
    token: String,
	is_active: {
		type: Boolean,
		default: true
	}
}, {timestamps: true}) // created at and updated at timestamps

// pre = hooks
UserSchema.pre('save', function(next){
	const user = this;
	const SALT_FACTOR = 10;
	if(!user.isModified('password')) next();
	bcrypt.genSalt(SALT_FACTOR, function(err,salt) {
		if(err) return next(err);
		bcrypt.hash(user.password, salt, function(error,hash){
			user.password = hash;
			next();
		});
	});
})

module.exports = mongoose.model('users', UserSchema);
