import express from 'express';
import cors from 'cors';
import { register } from './controllers/user.js';
import { getProducts, postProducts } from './controllers/products.js';
import validateSU from './middleware/validateSU.js';
import checkToken from './middleware/auth.js';
import signOut from './controllers/signOut.js';
import { getAddresses, postAddress, removeAddress } from './controllers/addresses.js';
import { getPurchases } from './controllers/purchases.js';

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
app.get('/products/:id', getProducts);
app.post('/products', validateSU, postProducts);

// ADDRESSES
app.get('/addresses', checkToken, getAddresses);
app.post('/addresses', checkToken, postAddress);
app.delete('/addresses/:id', checkToken, removeAddress);

// PURCHASES
app.get('/purchases/:userId', checkToken, getPurchases);

export default app;
