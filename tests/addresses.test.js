/* eslint-disable no-undef */
import '../src/setup.js';
import supertest from 'supertest';
import faker from 'faker';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import { fakeUserFactory } from '../src/factories/user.factory.js';
import { addressFactory, fakeAddressFactory } from '../src/factories/addresses.factory.js';

const fakeToken = faker.datatype.uuid();
let userId;

beforeAll(async () => {
    const fakeUser = fakeUserFactory();
    const result = await connection.query(`INSERT INTO users (name, email, cpf, phone, birth_date, password) 
    VALUES ('${fakeUser.name}', '${fakeUser.email}', '${fakeUser.cpf}', '${fakeUser.phone}', '${fakeUser.birthdate}', '${fakeUser.password}') RETURNING ID;`);
    userId = result.rows[0].id;
    await connection.query('INSERT INTO SESSIONS (user_id, token) VALUES ($1, $2);', [userId, fakeToken]);
});

afterAll(async () => {
    await connection.query('TRUNCATE users CASCADE;');
    connection.end();
});

describe('POST on /addresses', () => {
    it('returns status 401 for invalid token', async () => {
        const result = await supertest(app).post('/addresses');
        expect(result.status).toEqual(401);
    });

    it('returns status 201 for a successful address post', async () => {
        const validBody = fakeAddressFactory(userId, '');
        const result = await supertest(app)
            .post('/addresses')
            .send(validBody)
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(result.status).toEqual(201);
    });

    it('returns status 400 for invalid address', async () => {
        const invalidBody = fakeAddressFactory(userId, 'address');
        const result = await supertest(app)
            .post('/addresses')
            .send(invalidBody)
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(result.status).toEqual(400);
    });

    it('returns status 400 for invalid postal code', async () => {
        const invalidBody = fakeAddressFactory(userId, 'postalCode');
        const result = await supertest(app)
            .post('/addresses')
            .send(invalidBody)
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(result.status).toEqual(400);
    });
});

describe('GET addresses', () => {
    it('returns status 401 for invalid token', async () => {
        const result = await supertest(app).get('/addresses');
        expect(result.status).toEqual(401);
    });

    it('returns status 200 and an array for valid token', async () => {
        const result = await supertest(app)
            .get('/addresses')
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(result.status).toEqual(200);
        expect(result.body).toHaveLength(1);
    });
});

describe('DELETE from /addresses', () => {
    it('returns status 401 for invalid token', async () => {
        const result = await supertest(app).delete('/addresses/id');
        expect(result.status).toEqual(401);
    });

    it('returns status 400 for invalid id', async () => {
        const result = await supertest(app)
            .delete('/addresses/invalidId')
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(result.status).toEqual(400);
    });

    it('returns status 200 for successful address removal', async () => {
        const validBody = fakeAddressFactory(userId, '');
        const addressId = await addressFactory(validBody);
        const result = await supertest(app)
            .delete(`/addresses/${addressId.rows[0].id}`)
            .set('Authorization', `Bearer ${fakeToken}`);
        expect(result.status).toEqual(200);
    });
});
