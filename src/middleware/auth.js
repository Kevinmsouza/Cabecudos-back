/* eslint-disable comma-dangle */
import connection from '../database/database.js';

export default async function checkToken(req, res, next) {
    console.log("xau")
    const token = req.headers.authorization?.split('Bearer ')[1];
    console.log(token)
    const result = await connection.query('SELECT * FROM sessions WHERE token = $1', [token]);
    if (!result.rows.length) return res.sendStatus(401);
    next();
}
