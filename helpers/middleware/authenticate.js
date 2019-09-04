const jwt = require('jsonwebtoken');

const jwtKey =
  process.env.JWT_SECRET ||
  'add a .env file to root of project with the JWT_SECRET variable';

  
// implementation details
function authenticate(req, res, next) {
  const token = req.get('Authorization');
  
  if (token) {
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Your token has expired. Please sign in.', error: err });
      
      req.decoded = decoded;
      
      next();
    });
  } else {
    return res.status(401).json({
      error: 'No token provided, must be set on the Authorization Header',
    });
  }
}

//Generate JSON webtoken
function generateToken(slack_id) {
  const payload = {
    subject: slack_id,
  };

  const options = {
    expiresIn: '1h'
  };

  return jwt.sign(payload, jwtKey, options)
}

// quickly see what this file exports
module.exports = {
  authenticate,
  generateToken
};