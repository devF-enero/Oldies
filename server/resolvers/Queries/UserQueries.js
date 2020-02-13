const { getUsers, getUserByEmail, getUserByID, getMatchesByID } = require ('../../services/UserServices')
//root = graphQL server (how many queries, which port, etc. Do not modify)
// args = object 
// context = shared variable among all resolvers (single source of truth) (in object form)
// info = string of your query

const allUsers = (root, args, context, info) => {
	console.log(args)
	return getUsers(args);
}

const getOneUser = (root, args, context, info) => {
	if(args.email){
		return getUserByEmail(args.email)
	} else if (args.id) {
		return getUserByID(args.id)
	} else if (context.user._id) {
	    return getUserByID(getUserByID)
	}
	throw Error ("An email or ID is required")
}

const getAllMatches = async(root, args, context, info) => {
	const id = context.user._id ? context.user._id : args.id;
	if (id) {
		const user = await getMatchesByID(id);
		return user.matches
	} 
	throw Error ("You must be logged in to see your matches")
}

const getPossibleMatchUsers = async(root, args, context, info) => {
	const thisUser = context.user ? context.user : await getUserByID(args.id);
	if (!thisUser) throw Error ("You must be logged in to see more possible matches");

	const seenUsers = [...thisUser.rejects, ...thisUser.likes];
	const range = thisUser.age_range;

	if (thisUser.interested_in.includes('A')){
		return getUsers({ _id: { $nin: seenUsers } },
						{ age: { $gt: range.min, $lt: range.max }},
						{ interested_in: { $in: [thisUser.gender,'A'] } })
	}
	return getUsers({ _id: { $nin: seenUsers } },
					{ gender: { $in: user.interested_in } }, 
					{ age: { $gt: range.min, $lt: range.max } },
                    { interested_in: { $in: [thisUser.gender,'A'] } })
}



module.exports = {
	allUsers,
	getPossibleMatchUsers,
	getOneUser,
	getAllMatches
}