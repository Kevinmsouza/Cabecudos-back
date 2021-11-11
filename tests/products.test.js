/* eslint-disable no-undef */
import '../src/setup.js';
import supertest from 'supertest';
import faker from 'faker';
import app from '../src/app.js';
import connection from '../src/database/database.js';

const validBody = {
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price()).toFixed(0),
    stock: Number(faker.commerce.price()).toFixed(0),
    images: [
        'https://static3.tcdn.com.br/img/img_prod/460977/pre_venda_pop_homem_de_ferro_iron_man_i_am_iron_man_vingadores_ultimato_avengers_endgame_exclusivo_5_54509_1_20200116165752.jpg',
        'https://static3.tcdn.com.br/img/img_prod/460977/pre_venda_pop_homem_de_ferro_iron_man_i_am_iron_man_vingadores_ultimato_avengers_endgame_exclusivo_5_54509_1_20200116165752.jpg',
    ],
};

const SUToken = 'Bearer 7c44f47c-9619-462d-b698-d334025a541d';

beforeAll(async () => {
    await connection.query('TRUNCATE products CASCADE;');
});

afterAll(() => {
    connection.end();
});

describe('POST /products', () => {
    it('returns 200 for success', async () => {
        const result = await supertest(app)
            .post('/products')
            .set('Authorization', SUToken)
            .send(validBody);
        expect(result.status).toEqual(200);
    });

    it('returns 401 for no token', async () => {
        const result = await supertest(app)
            .post('/products')
            .send(validBody);
        expect(result.status).toEqual(401);
    });

    it('returns 403 for invalid SUtoken', async () => {
        const result = await supertest(app)
            .post('/products')
            .set('Authorization', 'Bearer 12345678-9619-462d-b698-d334025a541d')
            .send(validBody);
        expect(result.status).toEqual(403);
    });

    it('returns 400 for invalid body', async () => {
        const result = await supertest(app)
            .post('/products')
            .set('Authorization', 'Bearer 12345678-9619-462d-b698-d334025a541d')
            .send({
                ...validBody,
                stock: -1,
            });
        expect(result.status).toEqual(403);
    });
});

describe('GET /products', () => {
    afterEach(async () => {
        await connection.query('TRUNCATE products CASCADE;');
    });

    it('returns 1 length array for 1 product', async () => {
        const result = await supertest(app).get('/products');
        expect(result.body).toHaveLength(1);
    });

    it('returns empty array for empty DB', async () => {
        const result = await supertest(app).get('/products');
        expect(result.body).toHaveLength(0);
    });
});

describe('GET /products/:id', () => {
    it('returns 400 for invalid id', async () => {
        const result = await supertest(app).get('/products/a');
        expect(result.status).toEqual(400);
    });
});
