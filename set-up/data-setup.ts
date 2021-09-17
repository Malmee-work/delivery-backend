import { senders, bikers } from '../config/users';
import { executeQuery } from '../db/connect-db';

async function dataSetup() {
  await executeQuery(`DROP TABLE IF EXISTS sender;`);
  await executeQuery(`CREATE TABLE sender (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(45) NULL,
        password VARCHAR(45) NULL);`);
  await executeQuery(`INSERT INTO sender
    (username,
    password)
    VALUES
    ${senders}`);

  await executeQuery(`DROP TABLE IF EXISTS biker;`);
  await executeQuery(`CREATE TABLE biker (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(45) NULL,
        password VARCHAR(45) NULL);`);
  await executeQuery(`INSERT INTO biker
        (username,
        password)
        VALUES
        ${bikers}`);

  await executeQuery(`DROP TABLE IF EXISTS parcel;`);
  await executeQuery(`CREATE TABLE parcel (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        senderId INT NOT NULL,
        pickupAddress VARCHAR(45) NOT NULL,
        dropoffAddress VARCHAR(45) NOT NULL,
        bikerId INT NULL,
        pickupTime DATETIME NULL,
        dropoffTime DATETIME NULL,
        FOREIGN KEY(senderId) REFERENCES sender(id),
        FOREIGN KEY(bikerId) REFERENCES biker(id)
        );`);
  // eslint-disable-next-line no-console
  console.log('Successfully set up data');
}

export default dataSetup;
