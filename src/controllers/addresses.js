/* eslint-disable radix */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
import connection from '../database/database.js';
import { addressFactory } from '../factories/addresses.factory.js';
import { validateAddress } from '../validation/addresses.js';

async function getAddresses(req, res) {
    const token = req.headers.authorization?.split('Bearer ')[1];

    try {
        const addresses = await connection.query(`
            SELECT 
                addresses.id, addresses.address, addresses.postal_code, addresses.comp
            FROM 
                sessions  
            JOIN 
                addresses 
            ON 
                sessions.user_id = addresses.user_id
            WHERE 
                sessions.token = $1 AND
                deleted_at IS NULL
                ;`,
        [token]);
        res.status(200).send(addresses.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function postAddress(req, res) {
    try {
        if (validateAddress(req.body)) return res.sendStatus(400);
        await addressFactory(req.body);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function removeAddress(req, res) {
    const { id } = req.params;
    try {
        if (!Number.isInteger(Number(id)) || id <= 0) {
            return res.sendStatus(400);
        }
        // eslint-disable-next-line radix
        await connection.query(`
        UPDATE 
            addresses 
        SET deleted_at = $1
        WHERE 
            id = $2;`, [now(), DateparseInt(id)]);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export {
    getAddresses,
    postAddress,
    removeAddress,
};
