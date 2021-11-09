// eslint-disable-next-line consistent-return
export default function validateSU(req, res, next) {
    const userToken = req.headers.authorization?.replace('Bearer ', '');
    if (!userToken) return res.sendStatus(401);
    if (userToken !== '7c44f47c-9619-462d-b698-d334025a541d') return res.sendStatus(403);
    next();
}
