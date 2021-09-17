import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dataSetup from './set-up/data-setup';
import router from './route';

const app = express();
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
dataSetup();
app.use('/', router);
app.listen(4000);
// eslint-disable-next-line no-console
console.log('Running a API server at http://localhost:4000');
