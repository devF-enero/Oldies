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
  	name {first,middle,last}
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

{
  "Userdata": {
    "email": "yidah@gmail.com",
		"name": {"first": "yidah", "last": "rodriguez"},
    "age": 25,
    "age_range": {"min": 22, "max": 35},
    "password": "123456",
    "sex": "M",
    "interested_in": ["F",]
  }
}

{
  "Userdata": {
    "email": "alex@gmail.com",
		"name": {"first": "alex", "last": "santiago"},
    "age": 40,
    "age_range": {"min": 30, "max": 35},
    "password": "123456",
    "sex": "M",
    "interested_in": ["F","TW","N"]
  }
}

{
  "Userdata": {
    "email": "adrian@gmail.com",
		"name": {"first": "adrian", "last": "fernandez"},
    "age": 30,
    "age_range": {"min": 18, "max": 50},
    "password": "123456",
    "sex": "M",
    "interested_in": ["A"]
  }
}

create account (register)
login
logout
user cards (reject, like, (love))
my matches (button for chat)
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
  "data": {
    "newUser": {
      "_id": "5e45fd8d99014b2600fd40e0",
      "name": {
        "first": "adrian",
        "middle": null,
        "last": "fernandez"
      },
      "password": "$2b$10$Vi9UN2w7UTy139gAwQk66ewgaazdSIA7X8oUv5HTn9Ju/h7IroMHq",
      "age": 30,
      "age_range": {
        "min": 18,
        "max": 50
      },
      "sex": "M",
      "interested_in": [
        "A"
      ]
    }
  }
}

{
  "data": {
    "newUser": {
      "_id": "5e45fdc699014b2600fd40e1",
      "name": {
        "first": "gabriel",
        "middle": null,
        "last": "perez"
      },
      "password": "$2b$10$4PpeBMn5d4hCXD13Lco2PuFHfGwD6l81CGmOLzBcmZL6nzKMxt2BC",
      "age": 25,
      "age_range": {
        "min": 18,
        "max": 50
      },
      "sex": "M",
      "interested_in": [
        "F"
      ]
    }
  }
}

{
  "data": {
    "newUser": {
      "_id": "5e45fe19d97c7d3518255d79",
      "name": {
        "first": "yidah",
        "middle": null,
        "last": "curiel"
      },
      "password": "$2b$10$wplqItVuIxDYV6F8cL.zReirZ9hqFJvL.sIiWJVg9Ip84xO4WREYS",
      "age": 25,
      "age_range": {
        "min": 22,
        "max": 40
      },
      "sex": "F",
      "interested_in": [
        "A"
      ]
    }
  }
}

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