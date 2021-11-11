/* eslint-disable no-console */
/* eslint-disable consistent-return */
import connection from '../database/database.js';
import { addressFactory } from '../factories/addresses.factory.js';
import { validateAddres } from '../validation/addresses.js';

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
                token = $1;`,
        [token]);
        res.status(200).send(addresses.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function postAddress(req, res) {
    try {
        if (validateAddres(req.body)) return res.sendStatus(400);
        await addressFactory(req.body);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function removeAddress(req, res) {
    const { addressId } = req.body;
    try {
        if (!addressId) return res.sendStatus(404);
        await connection.query('DELETE FROM addresses WHERE id = $1', [addressId]);
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
