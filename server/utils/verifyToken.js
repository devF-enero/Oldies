const jwt = require('jsonwebtoken');
const { getUserByID } = require('../services/UserServices');
const SECRET = 'YourP0ff1sCut3!';

module.exports = async(request) => {
    const Authorization = request.get('Authorization');
    if (Authorization) {
        const formattedToken = Authorization.replace('JWT ', '');
        const payload = jwt.verify(formattedToken, SECRET);
        if (!payload) return request;
        const user = await getUserByID(payload.id);
        if (!user) return request;
        return {...request, user};
    } else {
        return request;
    }
}