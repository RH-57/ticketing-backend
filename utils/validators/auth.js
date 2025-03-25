const {body} = require('express-validator')
const prisma = require('../../prisma/client')

const validateRegister = [
    body('name').notEmpty().withMessage('Name is Required'),
    body('email')
        .notEmpty().withMessage('Email is Required')
        .isEmail().withMessage('Email is Invalid')
        .custom(async (value) => {
            if(!value) {
                throw new Error('Email is Required')
            }

            const user = await prisma.user.findUnique({where: { email: value}})
            if (user) {
                throw new Error('Email already exists')
            }
            return true
        }),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
]

const validateLogin = [
    body('email').notEmpty().withMessage('email is required'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
]

module.exports = { validateLogin, validateRegister}