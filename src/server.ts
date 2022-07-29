import * as http from 'http';
import express from 'express';
import cors from 'cors';
import RichPresenceController from './controllers/richPresence';
import AuthController from './controllers/auth';


const app = express();
const server = http.createServer(app);

app.use(cors({ origin: 'https://discord.com' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', RichPresenceController.bind);
app.use('/', AuthController.bind);

server.listen(8080, () => console.log('Started'));