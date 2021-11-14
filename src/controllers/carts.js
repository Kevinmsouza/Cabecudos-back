import connection from '../database/database.js';
import { validateCart } from '../validation/cart.js';

async function postCart(req, res) {
    const { cart } = req.body;
    if (validateCart(cart)) return res.sendStatus(400);
    const token = req.headers.authorization?.split('Bearer ')[1];
    const result = await connection.query('SELECT * FROM sessions WHERE token = $1', [token]);
    const userId = result.rows[0].user_id;
    await connection.query(`
        INSERT INTO carts
        (user_id, cart_text)
        VALUES ($1, $2)
    ;`, [userId, cart]);
    return res.sendStatus(201);
}

async function getCart(req, res) {
    const token = req.headers.authorization?.split('Bearer ')[1];
    const result = await connection.query(`
        SELECT 
            carts.id,
            carts.user_id,
            carts.cart_text
        FROM sessions
            JOIN carts 
                ON sessions.user_id = carts.user_id
        WHERE token = $1
    ;`, [token]);
    return res.send(result.rows);
}

export {
    postCart,
    getCart,
};
