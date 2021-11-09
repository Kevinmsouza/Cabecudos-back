import connection from '../database/database';

export default async function signOut(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    try {
        await connection.query('DELETE FROM sessions WHERE token = $1', [token]);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        res.sendStatus(500);
    }
}
