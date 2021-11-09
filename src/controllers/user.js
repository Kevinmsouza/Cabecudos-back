import bcrypt from 'bcrypt';
import connection from '../database/database.js';
import { validateUser, checkUnderage } from '../validation/user.js';

async function register(req, res) {
    // eslint-disable-next-line object-curly-newline
    const { name, cpf, phone, birthdate, imageUrl, email, password } = req.body;
    const { errors } = validateUser.validate(req.body);
    const majority = checkUnderage(birthdate);
    if (errors) return res.sendStatus(400);
    if (!majority) return res.status(403).send('Compras online são permitidas apenas para +18');
    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const existentEmail = await connection.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existentEmail.rows.length) return res.status(409).send('Este email já foi utilizado!');
        await connection.query('INSERT INTO users (name, email, cpf, phone, birth_date, password, image) VALUES ($1, $2, $3, $4, $5, $6, $7', [name, email, cpf, phone, birthdate, hashedPassword, (imageUrl || null)]);
        return res.sendStatus(201);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return res.sendStatus(500);
    }
}

async function login(req, res) {
    res.send();
}

export { register, login };
