import joi from 'joi';
import dayjs from 'dayjs';

function validateUser(user) {
    const userSchema = joi.object({
        name: joi.string().min(2).max(100).required(),
        cpf: joi.string().length(11).required(),
        birthdate: joi.string().isoDate().required(),
        email: joi.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required(),
        password: joi.string().min(4).required(),
        phone: joi.string().pattern(/^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/).required(),
    });
    return !!userSchema.validate(user).error;
}

function validateUserImage(imageUrl) {
    const userImageSchema = joi.string().pattern(/(https?:\/\/.*\.(?:png|jpg|jpeg|svg))/i);
    return !!userImageSchema.validate(imageUrl).error;
}

function checkUnderage(birthdate) {
    const now = dayjs();
    const age = now.diff(dayjs(birthdate), 'year');
    if (Number(age) < 18) return true;
    return false;
}

export { validateUser, checkUnderage, validateUserImage };
