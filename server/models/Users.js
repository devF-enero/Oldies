const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema ({
	name: {
		first: {type:String, required: true},
		middle: String,
		last: {type:String, required: true}
	},
	email: {type:String, required: true},
	password: {type: String, required: true},
	age: {type: Number, required: true, min: 18},
	age_range: {type: Number, default: 15, min: 2},
	location: String,	
	sex: {
		type: String,
		enum: ['M','F','TW','TM','N']
    },
    interested_in: {
        type: [String],
		enum: ['M','F','TW','TM','N','A']
	},
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
