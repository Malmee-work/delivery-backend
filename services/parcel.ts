import { executeQuery, get, getAll } from '../db/connect-db';
import { ParcelType } from './parcel-type';

async function createParcel(req: any, res: any) {
  if (req.body) {
    const response = await executeQuery(
      `INSERT INTO parcel (senderId, pickupAddress,dropoffAddress) VALUES (?,?,?);`,
      [req.user.id, req.body.pickupAddress, req.body.dropoffAddress]
    );
    return res.status(200).send({
      id: response.lastID,
      pickupAddress: req.body.pickupAddress,
      dropoffAddress: req.body.dropoffAddress,
      status: 'AVAILABLE'
    });
  }
  return res.status(500).send({ reason: 'Error in creating parcel' });
}

async function getSenderParcels(req: any, res: any) {
  if (req.body) {
    const response = await getAll(`SELECT * FROM parcel WHERE senderId = ?;`, [
      req.user.id
    ]);
    response.forEach((parcel: ParcelType) => {
      if (parcel.dropoffTime && new Date(parcel.dropoffTime) < new Date()) {
        parcel.status = 'DELIVERED';
      } else if (
        parcel.pickupTime &&
        new Date(parcel.pickupTime) < new Date()
      ) {
        parcel.status = 'DELIVERING';
      } else if (parcel.bikerId) {
        parcel.status = 'TO_BE_DELIVERED';
      } else {
        parcel.status = 'AVAILABLE';
      }
    });
    return res.status(200).send(response);
  }
  return res.status(500).send({ reason: 'Error in retrieving sender parcels' });
}

async function getBikerParcels(req: any, res: any) {
  if (req.body) {
    const response = await getAll(`SELECT * FROM parcel WHERE bikerId = ?;`, [
      req.user.id
    ]);
    response.forEach((parcel: ParcelType) => {
      if (parcel.dropoffTime && new Date(parcel.dropoffTime) < new Date()) {
        parcel.status = 'DELIVERED';
      } else if (
        parcel.pickupTime &&
        new Date(parcel.pickupTime) < new Date()
      ) {
        parcel.status = 'DELIVERING';
      } else {
        parcel.status = 'TO_BE_DELIVERED';
      }
    });
    return res.status(200).send(response);
  }
  return res.status(500).send({ reason: 'Error in retrieving biker parcels' });
}

async function getParcels(req: any, res: any) {
  if (req.body) {
    const response = await getAll(`SELECT * FROM parcel;`);
    response.forEach((parcel: ParcelType) => {
      if (parcel.dropoffTime && new Date(parcel.dropoffTime) < new Date()) {
        parcel.status = 'DELIVERED';
      } else if (parcel.bikerId === req.user.id) {
        parcel.status = 'TAKEN_BY_YOU';
      } else if (parcel.bikerId) {
        parcel.status = 'TAKEN';
      } else {
        parcel.status = 'AVAILABLE';
      }
    });
    return res.status(200).send(response);
  }
  return res.status(500).send({ reason: 'Error in retrieving biker parcels' });
}

async function assignParcel(req: any, res: any) {
  if (req.body) {
    const bikerId = await get(`SELECT bikerId FROM parcel where id = ?;`, [
      req.body.parcelId
    ]);

    if (bikerId && bikerId > 0) {
      return res.status(200).send([false, 'Parcel already taken']);
    }
    await executeQuery(`UPDATE parcel SET bikerId = ? WHERE id = ?;`, [
      req.user.id,
      req.body.parcelId
    ]);
    return res.status(200).send([true, 'Parcel assigned']);
  }
  return res.status(500).send({ reason: 'Error in retrieving biker parcels' });
}

async function updateParcel(req: any, res: any) {
  if (req.body && (req.body.pickupTime || req.body.dropoffTime)) {
    let variables = '';
    if (req.body.pickupTime) {
      variables = variables + `pickupTime='${req.body.pickupTime}'`;
    }
    if (req.body.pickupTime && req.body.dropoffTime) {
      variables = variables + ' , ';
    }
    if (req.body.dropoffTime) {
      variables = variables + `dropoffTime='${req.body.dropoffTime}'`;
    }
    const query = `UPDATE parcel SET ${variables} WHERE id = ${req.params.id};`;
    await executeQuery(query);
    return res.status(200).send([true, 'Parcel updated']);
  }
  return res.status(500).send({ reason: 'Error in retrieving biker parcels' });
}

export {
  createParcel,
  getSenderParcels,
  getBikerParcels,
  getParcels,
  assignParcel,
  updateParcel
};
