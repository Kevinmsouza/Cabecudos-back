import joi from 'joi';

function validateProduct(product) {
    const productSchema = joi.object({
        name: joi.string().min(3).max(40).required(),
        price: joi.number().min(1).required(),
        stock: joi.number().min(1).required(),
        images: joi.array().min(1).items(joi.string().pattern(/(https?:\/\/.*\.(?:png|jpg|jpeg))/i)),
    });
    return !!productSchema.validate(product).error;
}

// eslint-disable-next-line import/prefer-default-export
export { validateProduct };
