import express from 'express';
import cors from 'cors';
import { getProducts, postProducts } from './controllers/products.js';
import validateSU from './middleware/validateSU.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/check-status', (req, res) => {
    res.send('Belezinha');
});

// PRODUCTS
app.get('/products', getProducts);
app.post('/products', validateSU, postProducts);

export default app;
