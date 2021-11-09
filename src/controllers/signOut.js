import connection from '../database/database.js';

export default async function signOut(req, res) {
    const token = req.headers.authorization?.split('Bearer ')[1];

    try {
        await connection.query('DELETE FROM sessions WHERE token = $1', [token]);
        console.log("foi")
        res.sendStatus(200);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        res.sendStatus(500);
    }
}
