const { createInterest,
        addInterestToUser } = require ('../../services/InterestServices')

const newInterest = (root,args,context,info) => {
	return createInterest({name:args.name});
}

const newInterestforUser = (root,args,context,info) => {
    const userID = context.user ? context.user : args.id ? args.id : null;
    if (userID) return addInterestToUser(userID, args.interest);
    throw Error ("You must be loged in to add interests to your profile")
}

module.exports = {
    newInterest,
    newInterestforUser
}