// eslint-disable-next-line import/no-extraneous-dependencies

import faker from 'faker';
import connection from '../database/database.js';

faker.locale = 'pt_BR';

async function userFactory(body) {
    try {
        // eslint-disable-next-line object-curly-newline
        const { name, email, cpf, phone, birthdate, password, imageUrl } = body;
        return connection.query(`
            INSERT INTO users
            (name, email, cpf, phone, birth_date, password, image)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [name, email, cpf, phone, birthdate, password, (imageUrl || null)]);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return false;
    }
}


function fakeUserFactory(restriction) {
    const validUser = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        cpf: faker.datatype.number({ min: 10000000000, max: 99999999999 }).toString(),
        phone: faker.phone.phoneNumber(),
        birthdate: '1901-11-11',
        password: faker.internet.password(4),
        imageUrl: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
    };
    if (restriction === 'underAge') {
        delete validUser.birthdate;
        const underAgeUser = {
            ...validUser,
            birthdate: '2010-11-11',
        };
        return underAgeUser;
    }
    if (restriction === 'fixedEmail') {
        delete validUser.email;
        const fixedEmailUser = {
            ...validUser,
            email: 'test@test.test',
        };
        return fixedEmailUser;
    }
    if (restriction === 'unsafePassword') {
        delete validUser.password;
        const unsafePasswordUser = {
            ...validUser,
            password: '123',
        };
        return unsafePasswordUser;
    }
    if (restriction === 'emptyImage') {
        delete validUser.image;
        return validUser;
    }
    return validUser;
}

export {
    userFactory,
    fakeUserFactory,
};

