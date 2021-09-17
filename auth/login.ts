import jwt from 'jsonwebtoken';
import config from '../config';
import { get } from '../db/connect-db';

async function loginSender(req: any, res: any) {
  if (req.body && req.body.username && req.body.hashedPassword) {
    const sender = await get(`SELECT id FROM sender where username = ?;`, [
      req.body.username
    ]);
    if (!sender || !sender.id) {
      return res.status(403).send({ reason: 'Invalid user' });
    }
    sender.role = 'sender';
    const token = jwt.sign(sender, config.TOKEN_SECRET, {
      expiresIn: config.TOKEN_EXPIRE
    });

    return res.status(200).send({
      token: token
    });
  }
  return res.status(403).send({ reason: 'Missing credentials' });
}

async function loginBiker(req: any, res: any) {
  if (req.body && req.body.username && req.body.hashedPassword) {
    const sender = await get(`SELECT id FROM biker where username = ?;`, [
      req.body.username
    ]);
    if (!sender || !sender.id) {
      return res.status(403).send({ reason: 'Invalid user' });
    }
    sender.role = 'biker';
    const token = jwt.sign(sender, config.TOKEN_SECRET, {
      expiresIn: config.TOKEN_EXPIRE
    });

    return res.status(200).send({
      token: token
    });
  }
  return res.status(403).send({ reason: 'Missing credentials' });
}

export { loginSender, loginBiker };
