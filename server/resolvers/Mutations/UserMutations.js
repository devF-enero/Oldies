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
    const user = context.user ? context.user._id : args.id;
    const userLiked = args.userLiked;

    if (!user) throw Error ("Please login to start liking users");

    if (likedByThisUser(user, userLiked)) {
//        await addLikeToUser(user, userLiked);
        return addMatchToBothUsers(user,userLiked);
    }
    return addLikeToUser(user, userLiked);
}

const processUserRejections = async(root,args,context,info) => {
  const user = context.user ? context.user._id : args.id;
  const userRejected = args.userRejected;

    if (!user) throw Error ("Please login to start rejecting users");

    if (user.matches.contains(userRejected)) {
        return rejectUserMatch(user._id,userRejected);
    }
    return addRejectedToBothUsers(user._id,userRejected);
}

const newUser = async(root,args,context,info) => {
  if(args.data.photo){
		const { createReadStream }  = await args.data.photo;
		const stream = createReadStream();
		const image = await storage({ stream });
		args.data = {...args.data,photo:image.url};
	}
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


