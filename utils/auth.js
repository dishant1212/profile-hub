const jwt = require('jsonwebtoken');
const Users = require('../modules/users');

const secretKey = process.env.AUTH_SECRECT_KEY;

const setUser = (user) => {
  const payload = {
    id: user.userId,
    name: user.userName,
    emailId: user.emailId,
  };

  return jwt.sign(payload, secretKey);
};

const getUser = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
};

module.exports = {
  getUser,
  setUser,
};
