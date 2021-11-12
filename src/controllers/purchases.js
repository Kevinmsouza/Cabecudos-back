/* eslint-disable radix */
/* eslint-disable no-console */
import connection from '../database/database.js';

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

export {
    // eslint-disable-next-line import/prefer-default-export
    getPurchases,
};
