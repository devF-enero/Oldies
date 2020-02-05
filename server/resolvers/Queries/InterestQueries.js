const { getInterestByID,
	getInterests,
	getUsersbyInterest,
	getUsersbyAllInterests } = require ('../../services/InterestServices')

const allInterests = (root, args, context, info) => {
	return getInterests(args);
}

const getOneInterest = (root, args, context, info) => {
	return getInterestByID(args.id);
}

const getUsersbyAnyInterests = async(root, args, context, info) => {
    if (args.id) return getUsersbyInterest(args.id);
    if (args.interests) return getUsersbyInterest(args.interests);
    if (context.user) {
        return getUsersbyInterest(context.user.interests)
    }
    throw Error ("Please login or select an interest to filter users by")
}

const getUsersbyEveryInterest = async(root, args, context, info) => {
    if (args.interests) return getUsersbyAllInterests(args.interests); 
    if (context.user) {
        return getUsersbyAllInterests(context.user.interests)
    }
    throw Error ("Please login or select interests to filter users by")
}



module.exports = {
    allInterests,
    getUsersbyAnyInterests,
    getUsersbyEveryInterest,
    getOneInterest
}