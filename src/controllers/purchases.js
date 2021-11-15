/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
/* eslint-disable radix */
/* eslint-disable no-console */
import connection from '../database/database.js';
import { validatePurchase } from '../validation/purchase.js';

async function getPurchases(req, res) {
    const { userId } = req.params;

    try {
        if (!Number.isInteger(Number(userId)) || userId <= 0) {
            return res.sendStatus(400);
        }
        // eslint-disable-next-line radix
        const purchases = await connection.query(`
        SELECT 
            purchases.id, purchases.total_price, purchases.date, addresses.address, addresses.postal_code, addresses.comp
        FROM 
            purchases 
        JOIN
            addresses
        ON
            purchases.adress_id = addresses.id
        WHERE 
            purchases.user_id = $1
        ;`, [parseInt(userId)]);
        res.status(200).send(purchases.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function postPurchase(req, res) {
    if (validatePurchase(req.body)) return res.sendStatus(400);
    const { cart, address_id: addressId } = req.body;
    try {
        // Get userId by token
        const token = req.headers.authorization?.split('Bearer ')[1];
        const session = await connection.query('SELECT * FROM sessions WHERE token = $1', [token]);
        const userId = session.rows[0].user_id;

        // Validate stock disponibility while calculates total price
        const newStock = [];
        let totalPrice = 0;
        for (const product of cart) {
            const checkStock = await connection.query(`
                SELECT stock, price 
                FROM products 
                WHERE id = $1
            ;`, [product.id]);
            newStock.push(checkStock.rows[0].stock - product.qtd);
            totalPrice += checkStock.rows[0].price * product.qtd;
        }
        if (newStock.findIndex((n) => n < 0) >= 0) return res.sendStatus(400);

        // Register the purchase
        await connection.query(`
            INSERT INTO purchases
            (user_id, total_price, adress_id, date)
            VALUES ($1, $2, $3, NOW())
        ;`, [userId, totalPrice, addressId]);

        // Changing stock
        cart.forEach(async (product, i) => {
            await connection.query(`
                UPDATE products
                SET stock = $2
                WHERE id = $1
            ;`, [product.id, newStock[i]]);
        });

        // Cleaning user cart
        await connection.query("UPDATE carts SET cart_text = '[]' WHERE user_id = $1;", [userId]);

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export {
    getPurchases,
    postPurchase,
};
