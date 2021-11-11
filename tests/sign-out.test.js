/* eslint-disable no-undef */
import '../src/setup.js';
import supertest from 'supertest';
import faker from 'faker';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import { fakeUserFactory } from '../src/factories/user.factory.js';

const fakeToken = faker.datatype.uuid();

beforeAll(async () => {
    const fakeUser = fakeUserFactory();
    const result = await connection.query(`INSERT INTO users (name, email, cpf, phone, birth_date, password) 
    VALUES ('${fakeUser.name}', '${fakeUser.email}', '${fakeUser.cpf}', '${fakeUser.phone}', '${fakeUser.birthdate}', '${fakeUser.password}') RETURNING ID;`);
    await connection.query('INSERT INTO SESSIONS (user_id, token) VALUES ($1, $2);', [result.rows[0].id, fakeToken]);
});

afterAll(async () => {
    await connection.query('TRUNCATE users CASCADE;');
    connection.end();
});

describe('DELETE from /sign-out', () => {
    it('returns 401 for invalid token', async () => {
        const result = await supertest(app).delete('/sign-out');
        expect(result.status).toEqual(401);
    });

    it('returns 200 for terminated session', async () => {
        const result = await supertest(app)
            .delete('/sign-out')
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(result.status).toEqual(200);
    });
});
