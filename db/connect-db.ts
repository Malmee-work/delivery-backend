import config from '../config';
// eslint-disable-next-line
const sqlite3 = require('sqlite3').verbose();
import sqlite from 'sqlite';

let db: any;
const openDB = async () => {
  db = await sqlite.open({
    filename: config.DBURL,
    driver: sqlite3.Database
  });
};

const executeQuery = async (query: string, param?: any): Promise<any> => {
  try {
    if (!db) {
      await openDB();
    }
    return db.run(query, param);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`error thrown in running query: ${query} : `, e);
    throw e;
  }
};

const get = async (query: string, param?: any): Promise<any> => {
  try {
    if (!db) {
      await openDB();
    }

    return db.get(query, param);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`error thrown in running query: ${query} : `, e);
    throw e;
  }
};

const getAll = async (query: string, param?: any): Promise<any> => {
  try {
    if (!db) {
      await openDB();
    }

    return db.all(query, param);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`error thrown in running query: ${query} : `, e);
    throw e;
  }
};

export { executeQuery, get, getAll };
