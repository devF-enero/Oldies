const { createUser, 
    updateUserByID, 
    getUserByID, 
    deleteUserByID, 
    likedByThisUser,
	addLikeToUser,
	addMatchToBothUsers,
	addRejectedToBothUsers,
	removeMatchFromBothUsers} = require ('../../services/UserServices');
const authenticate = require ('../../utils/authenticate');

const processUserLikes = async(root,args,context,info) => {
    if (likedByThisUser(context.user._id, args.id)) {
        await addMatchToBothUsers(context.user._id,args.id);
        return {code: 200, message: 'Match created succesfully'};
    }
    await addLikeToUser(context.user._id, args.id);
    return {code: 200, message: 'Like added successfully'}
}

const processUserRejections = async(root,args,context,info) => {
    if (matchedWithThisUser(context.user._id, args.id)) {
        await removeMatchFromBothUsers(context.user._id,args.id);
    }
    await addRejectedToBothUsers(context.user._id,args.id);
    return {code: 200, message: 'User rejected successfully'}
}

const newUser = (root,args,context,info) => {
	return createUser(args.data);
}

const login = async(root, args) => {
	const token = await authenticate(args);
	return {
		token,
		message:'Token created succesfully'
	};
}

const updateUser = async(_, args) => {
    await updateUserByID(args.id, args.data);
	return getUserByID(args.id)
}

const deleteUser = async(_,args) => {
	await deleteUserByID(context.user._id);
	return {
		code: 204,
		message: 'User removed succesfully'
	}
}

module.exports = {
  //processUserLikes,
  //processUserRejections,
  newUser,
	login,
	updateUser,
	deleteUser
}


/*
sample mutation request:

mutation createUser($Userdata:UserAdd!) {
  newUser(data:$Userdata){
    _id
    first_name
    last_name
    email
    password
    age
    age_range
    gender
    looking_for
  }
}

query variables:
{
  "Userdata": {
    "email":"beavisc@gmail.com",
    "first_name": "yidah",
    "last_name": "curiel",
    "password": "123456",
    "gender": "F",
    "looking_for": ["F"],
    "age": 50,
    "age_range": 10
  }
}
*/

/*
response:
{
  "data": {
    "newUser": {
      "_id": "5e337f28afb4641bc4fcb691",
      "first_name": "yidah",
      "last_name": "curiel",
      "email": "beavisc@gmail.com",
      "password": "$2b$10$HVRp8lX.bAJdyM3Dt7rBX.ey6pDGf8njvXoiXux7vIZrBjA/L9ZBe",
      "age": 50,
      "age_range": 10,
      "gender": "F",
      "looking_for": [
        "F"
      ]
    }
  }
}
*/

/*
{
  "data": {
    "newUser": {
      "_id": "5e337c14010758332cd205ba",
      "first_name": "yidah",
      "last_name": "curiel",
      "email": "yidahc@yahoo.com",
      "age": 50,
      "age_range": 10,
      "gender": "F",
      "looking_for": [
        "F"
      ]
    }
  }
}
*/

/*
mutation{
  login(email:"beavisc@gmail.com",
    password:"123456"){
    token
    message
  }
}
*/