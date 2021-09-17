import express from 'express';
import { loginBiker, loginSender } from './auth/login';
import {
  createParcel,
  getSenderParcels,
  getBikerParcels,
  getParcels,
  assignParcel,
  updateParcel
} from './services/parcel';
import hasToken from './auth/has-token';
import { requestLimiter } from './middleware/request-limiter';

const router = express.Router();

router.post('/sender/login', loginSender);
router.post('/biker/login', loginBiker);
router.post('/parcel', hasToken, createParcel);
router.get('/sender/parcels', hasToken, getSenderParcels);
router.get('/biker/parcels', hasToken, getBikerParcels);
router.get('/parcels', hasToken, getParcels);
router.post('/biker/parcel', hasToken, requestLimiter, assignParcel);
router.post('/biker/parcel/:id', hasToken, updateParcel);

export default router;
