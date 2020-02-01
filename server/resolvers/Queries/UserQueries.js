const { getUsers, getUserByEmail, getUserByID } = require ('../../services/UserServices')
//root = graphQL server (how many queries, which port, etc. Do not modify)
// args = object 
// context = shared variable among all resolvers (single source of truth) (in object form)
// info = string of your query

const allUsers = (root, args, context, info) => {

	return getUsers(args);
	
}

const possibleMatchUsers = (root, args, context, info) => {
	user1 = context.user;
	const  range1 = user1.age-user1.age_range;
	const  range2 = user1.age+user1.age_range;
	
	if (user1.looking_for[0] == 'A'){
		return getUsers({ age: { $gt: range1, $lt: range2 }}, {_id:{$nin:user1.rejected}});
	}
	return getUsers({ gender:{$in: user1.looking_for}}, 
					{ age: { $gt: range1, $lt: range2 }}, 
					{rejected:{$nin: user1._id}} );	
}

const getOneUser = (root, args, context, info) => {
	if(args.email){
		return getUserByEmail(args.email, args.matchArgs)
	} else if (args.id) {
		return getUserByID(args.id, args.matchArgs)
	}
	throw Error ("An email or ID is required")
}

module.exports = {
	allUsers,
	possibleMatchUsers,
	getOneUser
}