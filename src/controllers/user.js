/* eslint-disable object-curly-newline */
import bcrypt from 'bcrypt';
import connection from '../database/database.js';
import { validateUser, checkUnderage, validateUserImage } from '../validation/user.js';
import { userFactory } from '../factories/user.factory.js';

async function checkInUse(column, value, res) {
    try {
        const existent = await connection.query(`SELECT * FROM users WHERE ${column} = $1`, [value]);
        if (existent.rows.length) return true;
        return false;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return res.sendStatus(500);
    }
}

async function register(req, res) {
    const { name, phone, birthdate, imageUrl, cpf, email, password } = req.body;
    if (imageUrl && validateUserImage(imageUrl)) return res.sendStatus(400);
    if (validateUser({ name, email, cpf, phone, birthdate, password })) return res.sendStatus(400);
    if (checkUnderage(birthdate)) return res.status(403).send('Compras online são permitidas apenas para +18');
    const existentCpf = await checkInUse('cpf', cpf);
    const existentEmail = await checkInUse('email', email);
    if (existentCpf) return res.status(409).send('Este CPF já foi utilizado!');
    if (existentEmail) return res.status(409).send('Este email já foi utilizado!');
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await userFactory({ ...req.body, password: hashedPassword });
    if (!newUser) return res.sendStatus(500);
    return res.sendStatus(201);
}

async function login(req, res) {
    res.send();
}

export { register, login };
