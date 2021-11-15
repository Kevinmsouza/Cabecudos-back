/* eslint-disable object-curly-newline */

import faker from 'faker';
import connection from '../database/database.js';

faker.locale = 'pt_BR';

async function addressFactory({ userId, address, postalCode, comp }) {
    // eslint-disable-next-line no-undef
    return connection.query(`
    INSERT INTO 
        addresses 
        (user_id, address, postal_code, comp)
    VALUES
        ($1, $2, $3, $4) RETURNING id
    ;`, [userId, address, postalCode, comp || null]);
}

function fakeAddressFactory(userId, restriction) {
    const validAddress = {
        userId,
        address: faker.address.streetAddress(),
        postalCode: faker.address.zipCode(),
        comp: faker.address.secondaryAddress(),
    };
    if (restriction === 'address') {
        validAddress.address = 123;
    }
    if (restriction === 'postalCode') {
        validAddress.postalCode = 123;
    }
    return validAddress;
}

export {
    addressFactory,
    fakeAddressFactory,
};
