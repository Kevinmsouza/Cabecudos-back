import joi from 'joi';

const validateAdress = data => {
    const schema = joi.object({
        adress: joi.string().min(5).regex(/\d/).regex(/[a-zA-Z]/).required(),
        postalCode: joi.string().length(8).required(),
        comp: joi.string().max(50),
    }).unknown();
    console.log( schema.validate(data).error);
    return schema.validate(data).error;
};

export {
    // eslint-disable-next-line import/prefer-default-export
    validateAdress,
};
