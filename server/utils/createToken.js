const jwt = require ('jsonwebtoken');
const SECRET = 'YourP0ff1sCut3!'

module.exports = (user) => {
    const payload = { // informacion del usuarion que se esta autenticando, para mandar al cliente
        id: user._id,
        email: user.email,
        first_name: user.first_name,
    };

    return jwt.sign(payload, SECRET, {expiresIn:'1d'}); // expiresIn is a JWT method
}