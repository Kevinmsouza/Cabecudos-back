import joi from 'joi';

const validateAddress = (data) => {
    const schema = joi.object({
        // eslint-disable-next-line newline-per-chained-call
        address: joi.string().min(3).regex(/\d/).regex(/[a-zA-Z]/).required(),
        postalCode: joi.string().length(9).regex(/^[0-9]{5}-[0-9]{3}$/).required(),
        comp: joi.string().max(50),
    }).unknown();
    return schema.validate(data).error;
};

export {
    // eslint-disable-next-line import/prefer-default-export
    validateAddress,
};
