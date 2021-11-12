/* eslint-disable no-undef */
import '../src/setup.js';
import faker from 'faker';
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import { fakeUserFactory, userFactory } from '../src/factories/user.factory.js';

afterAll(async () => {
    await connection.query('DELETE FROM users;');
    await connection.query('DELETE FROM sessions;');
    connection.end();
});

describe('POST /sign-up', () => {
    afterEach(async () => {
        await connection.query('DELETE FROM users;');
    });

    it('returns 201 for user registered with a full and valid body', async () => {
        const validUser = fakeUserFactory();
        const result = await supertest(app)
            .post('/sign-up')
            .send(validUser);
        expect(result.status).toEqual(201);
    });

    it('return 409 for email/cpf already in use', async () => {
        const user = fakeUserFactory();
        await userFactory(user);
        const result = await supertest(app)
            .post('/sign-up')
            .send(user);
        expect(result.status).toEqual(409);
    });

    it('return 403 for underAge sign-up', async () => {
        const underAgeUser = fakeUserFactory('underAge');
        const result = await supertest(app)
            .post('/sign-up')
            .send(underAgeUser);
        expect(result.status).toEqual(403);
    });

    it('return 400 for unsafe password', async () => {
        const unsafePasswordUser = fakeUserFactory('unsafePassword');
        const result = await supertest(app)
            .post('/sign-up')
            .send(unsafePasswordUser);
        expect(result.status).toEqual(400);
    });

    it('return 201 for user registered with valid body and empty image', async () => {
        const emptyImageUser = fakeUserFactory('emptyImage');
        const result = await supertest(app)
            .post('/sign-up')
            .send(emptyImageUser);
        expect(result.status).toEqual(201);
    });
});

describe('POST /sign-in', () => {
    it('return 201 for user logged-in succesfully', async () => {
        const mockUser = fakeUserFactory();
        await supertest(app).post('/sign-up').send(mockUser);
        const { email, password } = mockUser;
        const result = await supertest(app)
            .post('/sign-in')
            .send({ email, password });
        expect(result.status).toEqual(201);
    });

    it('return 404 for logging with wrong password', async () => {
        const mockUser = fakeUserFactory();
        await supertest(app).post('/sign-up').send(mockUser);
        const { email } = mockUser;
        const password = faker.internet.password(4);
        const result = await supertest(app)
            .post('/sign-in')
            .send({ email, password });
        expect(result.status).toEqual(404);
    });
});
