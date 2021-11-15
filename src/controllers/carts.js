import connection from '../database/database.js';
import { validateCart } from '../validation/cart.js';

// eslint-disable-next-line consistent-return
async function postCart(req, res) {
    const { cart } = req.body;
    if (validateCart(cart)) return res.sendStatus(400);
    const token = req.headers.authorization?.split('Bearer ')[1];
    try {
        const result = await connection.query('SELECT * FROM sessions WHERE token = $1', [token]);
        const userId = result.rows[0].user_id;
        const checkCart = await connection.query('SELECT * FROM carts WHERE user_id = $1;', [userId]);
        if (!checkCart.rows.length) {
            await connection.query(`
                INSERT INTO carts
                (user_id)
                VALUES ($1)
            ;`, [userId]);
        } else {
            await connection.query(`
            UPDATE carts
            SET cart_text = $2
            WHERE user_id = $1
        ;`, [userId, cart]);
        }
        return res.sendStatus(200);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        res.sendStatus(500);
    }
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
