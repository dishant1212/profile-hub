const { getUser } = require('../utils/auth');

const restrictToLoggedinUserOnly = (req, res, next) => {
  const userUid = req.cookies?.uid;
  // const csrfHeader = req.headers['x-csrf-token'];

  if (!userUid) return res.status(401).json({ message: 'Unauthoried' });

  const user = getUser(userUid);

  if (!user) return res.status(401).json({ message: 'Unauthoried' });

  req.user = user;

  next();
};

module.exports = restrictToLoggedinUserOnly;
