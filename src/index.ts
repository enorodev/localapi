import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import express from 'express';
import cors from 'cors';
import RichPresenceController from './controllers/richPresence/index.js';
import AuthController from './controllers/auth/index.js';


const app = express();

app.use(cors({ origin: 'https://discord.com' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', RichPresenceController.bind);
app.use('/', AuthController.bind);
app.get('/', (req, res) => res.send('ping'));

const server = https.createServer({
    key: fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/cert.pem')
}, app);

server.listen(3000, () => console.log('Started'));