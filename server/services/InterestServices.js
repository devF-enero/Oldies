const User = require('../models/Users');
const Interest = require('../models/Interests');

const getInterests = (args) => { 
	return Interest.find(args).exec(); 
}

const getInterestByID = (_id) => {
    return Interest.findById({_id}).exec()
}
/*
const getInterestByName = (name) => {
    return Interest.find({name:/^name/}).exec()
}
*/

const createInterest = (name) => {
	return Interest.create({name});
}

const addInterestToUser = (_id, interest) => {
    return User.findByIdAndUpdate({_id}, {$push: {interests:interest}}, {new:true});
}

const getUsersbyInterest = (interest) => { // interest can be an array or a single id
	return User.find({interests:{$in:interest}}).exec(); // will return any user with at least 1 interest in common
}

const getUsersbyAllInterests = (interest) => { // only works if interest is an array
	return User.find({interests:{$all:interest}}).exec(); // will only return users that match all the interests in the input array
}

module.exports = {
	getInterestByID,
	getInterests,
	getUsersbyInterest,
	getUsersbyAllInterests,
	createInterest,
	addInterestToUser
}