const validateAdress = data => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(20).regex(/^[A-Za-z0-9\s]+$/).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(1).required()
    }).unknown();
    return schema.validate(data).error;
};

export {
    // eslint-disable-next-line import/prefer-default-export
    validateAdress,
};
