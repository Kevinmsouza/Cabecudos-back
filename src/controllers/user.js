/* eslint-disable object-curly-newline */
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
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

function specifyError(error) {
    switch (error) {
    case 'name':
        return 'O nome inserido é muito curto, ou muito comprido';
    case 'cpf':
        return 'CPF inválido';
    case 'birthdate':
        return 'A data inserida nã é válida';
    case 'email':
        return 'Formato de email inválido';
    case 'password':
        return 'Senha deve ter no mínimo 4 carácteres';
    case 'phone':
        return 'Telefone inválido. Ex: +55 (99) 9 9999 9999';
    default:
        return 'Nenhum erro encontrado';
    }
}

async function register(req, res) {
    const { name, phone, birthdate, imageUrl, cpf, email, password } = req.body;
    const invalidBody = validateUser({ name, email, cpf, phone, birthdate, password });
    if (imageUrl && validateUserImage(imageUrl)) return res.status(400).send('Esta imagem é inválida!');
    if (invalidBody) return res.status(400).send(specifyError(invalidBody));
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
    const { email, password } = req.body;
    try {
        const result = await connection.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (user && bcrypt.compareSync(password, user.password)) {
            const activeSession = await connection.query('SELECT * FROM sessions WHERE user_id = $1', [user.id]);
            if (!activeSession.rows.length) {
                const token = uuid();
                await connection.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2)', [user.id, token]);
                return res.status(201).send({ ...user, token });
            }
            return res.status(201).send({ ...user, token: activeSession.rows[0].token });
        }
        return res.status(404).send('Email e/ou senha estão incorretos!');
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return res.sendStatus(500);
    }
}

export { register, login };
