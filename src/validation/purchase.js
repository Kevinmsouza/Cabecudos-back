import joi from 'joi';

function validatePurchase(purchase) {
    const purchaseSchema = joi.object({
        cart: joi.array().items(
            joi.object({
                id: joi.number().integer().min(1).required(),
                qtd: joi.number().integer().min(1).required(),
            }).unknown().required(),
        ),
        address_id: joi.number().integer().min(1).required(),
    });
    return !!purchaseSchema.validate(purchase).error;
}

// eslint-disable-next-line import/prefer-default-export
export { validatePurchase };
