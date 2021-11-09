import express from 'express';
import cors from 'cors';
import { register } from './controllers/user.js';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/sign-up', register);

app.get('/check-status', (req, res) => {
    res.send('Belezinha');
});

export default app;
