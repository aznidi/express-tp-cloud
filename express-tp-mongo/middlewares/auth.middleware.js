const jwt = require('jsonwebtoken');
const secretKey = 'winners';

const verifyJWTToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ message: 'Access Denied' });
  
    try {
      const verified = jwt.verify(token.split(' ')[1], secretKey);
      if(!verified) return res.status(401).json({ message: 'Invalid Token' });
      req.user = verified;
      next();
    } catch (err) {
      res.status(400).json({ message: 'Invalid Token' });
    }
}


module.exports = {
    verifyJWTToken
}