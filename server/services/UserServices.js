const User = require('../models/Users');

const getUsers = (args) => { // pass the arguement (as an object) of which Users to find in your query 
	return User.find(args).exec(); // exec returns a promise. GraphQL will resolve that promise and return the result
}

/*
const getActiveUsers = () => {
    return User.find({is_active:true}).exec();
}
*/
const likedByThisUser = async(user1id, user2id) => { //id1 es quien está DANDO el like id2 es el ID de quien está RECIBIENDO el like
	const user = await User.findOne({ _id:user2id, likes:user1id}).exec();
	if (!user) return false;
	return true

	/*
	user = await User.findOne({ _id:user2id, 'interactions': { $elemMatch: { user:user1id, status: {$in:['L','SL']} } } }).exec();
	if (!user) return false;
	for (interaction in user.interactions) {
		if (interaction.user == user1id) return interaction.status
	}
	*/
}

const matchedWithThisUser = async(user1id, user2id) => { 
	const user = await User.findOne({ _id:user2id, matches:user1id}).exec();
	if (!user) return false;
	return true
}

const removeMatchFromBothUsers = async(user1id, user2id) => { 
	await User.updateOne({_id:user2id, 'interactions': {user:user1id}});
	//await User.update({_id:user1id}, {$pull: {matches:user2id}});
}

const addMatchToBothUsers = async(user1id, user2id) => { 
	await User.update({_id:user2id}, {$push: {matches:user1id}});
	await User.update({_id:user1id}, {$push: {matches:user2id}});
}

const addLikeToUser = async(user1id, user2id) => { //id1 es quien está DANDO el like id2 es el ID de quien está RECIBIENDO el like
	user1 = await User.update({_id:user1id}, {$push: {likes:user2id}});
}

const addRejectedToBothUsers = async(user1id, user2id) => { //id1 es quien está DANDO el like id2 es el ID de quien está RECIBIENDO el like
	await User.update({_id:user1id}, {$push: {rejected:user2id}});
	await User.update({_id:user2id}, {$push: {rejected:user1id}});
}

const removeRejectedFromBothUsers = async(user1id, user2id) => { //id1 es quien está DANDO el like id2 es el ID de quien está RECIBIENDO el like
	await User.update({_id:user1id}, {$pull: {rejected:user2id}});
	await User.update({_id:user2id}, {$pull: {rejected:user1id}});
}

const getUserByEmail = (email) => {
	return User.findOne({email}).exec();
}

const getUserByID = (_id) => {
    return User.findOne({_id}).exec()
}

const createUser = (data) => {
	return User.create(data);
}

const updateUserByID = (_id, data) => {
	return User.update({_id},{'$set':{...data}}, {new:true});
}

const updateUserByEmail = (email, data) => {
	return User.findOneAndUpdate({email},{'$set':{...data}}, {new:true}); // {new:true} is for mongo to show the newly modified record (unsafe)
}

const deleteUserByID = (id) => {
	return User.findOneAndUpdate({_id:id},{'$set':{is_active:false}});
}

module.exports = {
	getUsers,
	likedByThisUser,
	matchedWithThisUser,
	addLikeToUser,
	addMatchToBothUsers,
	addRejectedToBothUsers,
	removeRejectedFromBothUsers,
	removeMatchFromBothUsers,
	getUserByID,
	getUserByEmail,
	createUser,
	updateUserByEmail,
	updateUserByID,
	deleteUserByID
}