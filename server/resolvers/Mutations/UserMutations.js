const { createUser, 
    updateUserByID, 
    getUserByID, 
    deleteUserByID, 
    likedByThisUser,
	addLikeToUser,
	addMatchToBothUsers,
	addRejectedToBothUsers,
	rejectUserMatch} = require ('../../services/UserServices');
const authenticate = require ('../../utils/authenticate');

const processUserLikes = async(root,args,context,info) => {
    const user = context.user._id ? context.user._id : args.id;
    const userLiked = args.userLiked;

    if (!user) throw Error ("Please login to start liking users");

    if (likedByThisUser(user, userLiked)) {
        await addLikeToUser(user, userLiked);
        return addMatchToBothUsers(user,userLiked);
    }
    return addLikeToUser(user, userLiked);
}

const processUserRejections = async(root,args,context,info) => {
    const user = context.user ? context.user : await getUserByID(args.id);
    const userRejected = args.userRejected;

    if (!user) throw Error ("Please login to start rejecting users");

    if (user.matches.contains(userRejected)) {
        return rejectUserMatch(user._id,userRejected);
    }
    return addRejectedToBothUsers(user._id,userRejected);
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

const updateUser = async(_, args, context) => {
    await updateUserByID(context.user._id, args.data);
	return getUserByID(context.user._id)
}

const deleteUser = async(_,args,context) => {
	await deleteUserByID(context.user._id);
	return {
		code: 204,
		message: 'User removed succesfully'
	}
}


module.exports = {
  processUserLikes,
  processUserRejections,
  newUser,
	login,
	updateUser,
	deleteUser
}


/*
sample mutation request:

mutation createUser($Userdata:UserAdd!){
  newUser(data:$Userdata){
    _id
  	name {first,last}
    password
    age
    age_range {min, max}
    sex
    interested_in
  }
  
}

query variables:
{
  "Userdata": {
    "email": "melissa@gmail.com",
		"name": {"first": "melissa", "last": "rodriguez"},
    "age": 50,
    "age_range": {"min": 40, "max": 60},
    "password": "123456",
    "sex": "M",
    "interested_in": "F"
  }
}
*/

/*
response:
{
  "data": {
    "newUser": {
      "_id": "5e3a5b249454e7210479a5b6",
      "name": {
        "first": "melissa",
        "last": "rodriguez"
      },
      "password": "$2b$10$iAYW/j/xbXI4UQ8.WTVUYOP5Shos.quqCySAdOcVpRvVixBw5o.Pi",
      "age": 50,
      "age_range": {
        "min": 40,
        "max": 60
      },
      "sex": "M",
      "interested_in": [
        "F"
      ]
    }
  }
}
*/

/*
{
        "_id": "5e34f127ce2782152c796a5a",
        "email": "edwin2@devf.mx",
        "first_name": "yidah",
        "last_name": "curiel",
        "is_active": true
      }

   pswd: "123456"
   toke: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMzRmMTI3Y2UyNzgyMTUyYzc5NmE1YSIsImVtYWlsIjoiZWR3aW4yQGRldmYubXgiLCJmaXJzdF9uYW1lIjoieWlkYWgiLCJpYXQiOjE1ODA1Mjg1MjIsImV4cCI6MTU4MDYxNDkyMn0.nzbXEtbDNoQgi6p958v3ue5mGCud2uN8t2Yuuwz7R3o",
*/