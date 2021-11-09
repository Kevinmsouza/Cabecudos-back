/* eslint-disable comma-dangle */
import connection from '../database/database';

export default async function checkToken(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const result = await connection.query('SELECT * FROM sessions WHERE token = $1', [token]);
    if (result.rows.length) return res.sendStatus(401);
    next();
}
