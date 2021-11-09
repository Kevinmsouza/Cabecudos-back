/* eslint-disable no-undef */
import '../src/setup.js';
import supertest from 'supertest';
import faker from 'faker';
import app from '../src/app.js';
import connection from '../src/database/database.js';

const fakeToken = faker.datatype.uuid();

beforeAll(async () => {
    const result = await connection.query(`INSERT INTO users (name, email, cpf, phone, birth_date, password) 
    VALUES ('test', 'test@test.com', '03873636389', '45998022472', '04/08/1994', '123456') RETURNING ID;`);
    await connection.query('INSERT INTO SESSIONS (user_id, token) VALUES ($1, $2);', [result.rows[0].id, fakeToken]);
});

afterAll(async () => {
    await connection.query('DELETE FROM sessions;');
    await connection.query('DELETE FROM users;');
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
