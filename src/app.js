import express from 'express';
import cors from 'cors';
import { register } from './controllers/user.js';
import { getProducts, postProducts } from './controllers/products.js';
import validateSU from './middleware/validateSU.js';
import checkToken from './middleware/auth.js';
import signOut from './controllers/signOut.js';

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

export default app;
