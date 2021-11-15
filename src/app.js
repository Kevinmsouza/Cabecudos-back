import express from 'express';
import cors from 'cors';
import { register, login } from './controllers/user.js';
import { getProducts, postProducts } from './controllers/products.js';
import validateSU from './middleware/validateSU.js';
import checkToken from './middleware/auth.js';
import signOut from './controllers/signOut.js';
import { getAddresses, postAddress, removeAddress } from './controllers/addresses.js';
import { getPurchases } from './controllers/purchases.js';
import { getCart, postCart } from './controllers/carts.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/check-status', (req, res) => {
    res.send('Belezinha');
});

// USERS
app.post('/sign-up', register);
app.post('/sign-in', login);
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

// CARTS
app.get('/carts', checkToken, getCart);
app.post('/carts', checkToken, postCart);

export default app;
