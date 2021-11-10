import express from 'express';
import cors from 'cors';
import { register } from './controllers/user.js';
import { getProducts, postProducts } from './controllers/products.js';
import validateSU from './middleware/validateSU.js';
import checkToken from './middleware/auth.js';
import signOut from './controllers/signOut.js';
import { getAdresses, postAdress } from './controllers/adresses.js';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/sign-up', register);

app.get('/check-status', (req, res) => {
    res.send('Belezinha');
});

app.delete('/sign-out', checkToken, signOut);

// PRODUCTS
app.get('/products', getProducts);
app.post('/products', validateSU, postProducts);

// ADRESSES
app.get('/adresses', checkToken, getAdresses);
app.post('/adresses', checkToken, postAdress);

export default app;
