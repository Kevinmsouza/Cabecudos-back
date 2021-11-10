import connection from '../database/database.js';
import { validateAdress } from '../validation/adresses.js';

async function getAdresses(req, res) {
    const token = req.headers.authorization?.split('Bearer ')[1];

    try {
        const adresses = await connection.query(`
            SELECT 
                *
            FROM 
                sessions  
            JOIN 
                adresses 
            ON 
                sessions.user_id = adresses.user_id
            WHERE 
                token = $1;`,
        [token]);
        res.status(200).send(adresses.rows);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        res.sendStatus(500);
    }
}

async function postAdress(req, res) {
    const {
        userId,
        adress,
        postalCode,
        city,
        ufId,
    } = req.body;

    try {
        if (validateAdress(req.body)) return res.sendStatus(400);
        await connection.query(`
        INSERT INTO 
            adresses 
            (user_id, adress, postal_code, city, uf_id
        VALUES
            ($1, $2, $3, 'toledo', 15)
        ;`, [userId, adress, postalCode]);
        res.sendStatus(201);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        res.sendStatus(500);
    }
}

export {
    getAdresses,
    postAdress,
};
