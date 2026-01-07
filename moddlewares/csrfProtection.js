const csrf = require('csurf');

const csrfProtection = csrf({
  httpOnly: true,
  secure: true,
  sameSite: 'none',
});

module.exports = csrfProtection;
