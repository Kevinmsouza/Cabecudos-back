import connection from '../database/database.js';

// eslint-disable-next-line consistent-return
export default async function validateSU(req, res, next) {
    const userToken = req.headers.authorization?.replace('Bearer ', '');
    if (!userToken) return res.sendStatus(401);
    try {
        const result = await connection.query('SELECT * FROM super_users WHERE token = $1;', [userToken]);
        if (!result.rows.length) return res.sendStatus(403);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return res.sendStatus(500);
    }
    next();
}
