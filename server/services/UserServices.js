const User = require('../models/Users');

const getUsers = (args) => { // pass the arguement (as an object) of which Users to find in your query 
	return User.find(args).exec(); // exec returns a promise. GraphQL will resolve that promise and return the result
}

/*
const getActiveUsers = () => {
    return User.find({is_active:true}).exec();
}
*/
const getUserByEmail = (email) => {
	return User.findOne({email}).exec();
}

const getUserByID = (_id) => {
    return User.findById({_id}).exec()
}

const createUser = (data) => {
	return User.create(data);
}

const getMatchesByID = (_id) => {
    return User.findById({_id}).populate('matches').exec()
}

const updateUserByID = (_id, data) => {
	return User.update({_id},{'$set':{...data}}, {new:true});
}

const updateUserByEmail = (email, data) => {
	return User.findOneAndUpdate({email},{'$set':{...data}}, {new:true}); // {new:true} is for mongo to show the newly modified record (unsafe)
}

const deleteUserByID = (id) => {
	return User.findOneAndUpdate({_id:id},{'$set':{is_active:false}},{new:true});
}

const likedByThisUser = async(user1id, user2id) => { //id1 es quien está DANDO el like id2 es el ID de quien está RECIBIENDO el like
	const user = await User.findOne({ _id:user2id, likes:user1id}).exec();
	if (!user) return false;
	return true
}

const matchedWithThisUser = async(user1id, user2id) => { 
	const user = await User.findOne({ _id:user2id, matches:user1id}).exec();
	if (!user) return false;
	return true
}

const rejectUserMatch = async(_id, rejectedUserID) => { 
	await User.updateMany({_id:rejectedUserID}, {$pull: {matches:_id}, $push: {rejects:_id}});
	await User.updateMany({_id}, {$pull: {matches:rejectedUserID}, $push: {rejects:rejectedUserID}});
	return User.findById({_id}).populate('matches').exec();
}

const addMatchToBothUsers = async(user1id, user2id) => { 
	await User.findByIdAndUpdate({_id:user2id}, {$push: {matches:user1id}});
	return User.findByIdAndUpdate({_id:user1id}, {$push: {matches:user2id}}, {new:true}).populate('matches');
}

const addLikeToUser = (user1id, user2id) => { //id1 es quien está DANDO el like id2 es el ID de quien está RECIBIENDO el like
	return User.findByIdAndUpdate({_id:user1id}, {$push: {likes:user2id}}, {new:true});
}

const addRejectedToBothUsers = async(user1id, user2id) => { //id1 es quien está DANDO el like id2 es el ID de quien está RECIBIENDO el like
	await User.findByIdAndUpdate({_id:user2id}, {$push: {rejects:user1id}});
	return User.findByIdAndUpdate({_id:user1id}, {$push: {rejects:user2id}}, {new:true});
}

const removeRejectedFromBothUsers = async(user1id, user2id) => { //id1 es quien está DANDO el like id2 es el ID de quien está RECIBIENDO el like
	await User.findByIdAndUpdate({_id:user2id}, {$pull: {rejects:user1id}});
	return User.findByIdAndUpdate({_id:user1id}, {$pull: {rejects:user2id}}, {new:true});
}


module.exports = {
	getUsers,
	likedByThisUser,
	matchedWithThisUser,
	addLikeToUser,
	addMatchToBothUsers,
	addRejectedToBothUsers,
	removeRejectedFromBothUsers,
	rejectUserMatch,
	getUserByID,
	getUserByEmail,
	createUser,
	updateUserByEmail,
	updateUserByID,
	deleteUserByID,
	getMatchesByID
}


/*
"newUser": {
      "_id": "5e3a5acc9454e7210479a5b5",
      "name": {
        "first": "yidah",
        "last": "curiel"
      },
      "password": "$2b$10$tEZUgj1I/eam4RIXqkvmPu.Ikgjg.hLSPjgRokH7MrDRpKRe7Vz52",
      "age": 50,
      "age_range": {
        "min": 40,
        "max": 60
      },
      "sex": "M",
      "interested_in": [
        "F"
	  ]
	*/