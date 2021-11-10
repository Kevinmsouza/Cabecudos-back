import joi from 'joi';

const validateAdress = data => {
    const schema = joi.object({
        adress: joi.string().min(5).regex(/\d/).regex(/[a-zA-Z]/).required(),
        postal_code: joi.string().length(8).required(),
    }).unknown();
    return schema.validate(data).error;
};

export {
    // eslint-disable-next-line import/prefer-default-export
    validateAdress,
};
