import joi from 'joi';

function validateCart(cart) {
    const cartSchema = joi.string().pattern(/^\[\]$/).required();
    return !!cartSchema.validate(cart).error;
}

// eslint-disable-next-line import/prefer-default-export
export { validateCart };
