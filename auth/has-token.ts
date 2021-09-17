import jwt from 'jsonwebtoken';
import config from '../config';

function hasToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send({ reason: 'Missing access token' });
  }

  jwt.verify(token, config.TOKEN_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(401).send({ reason: 'Token is invalid' });
    }
    req.user = user;
    next();
  });
}

export default hasToken;
