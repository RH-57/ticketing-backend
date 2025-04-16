const { body } = require('express-validator')
const prisma = require('../../prisma/client')

const validateUser = [
    body('name').notEmpty().withMessage('Name is Required'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email is invalid')
        .custom(async (value, {req}) => {
            if(!value) {
                throw new Error('email required')
            }

            const user = await prisma.user.findUnique({where: {email: value}})
            if(user && user.id !== Number(req.params.id)) {
                throw new Error('email already exists')
            }

            return true
        }),
    body('password').optional().isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['superadmin', 'admin', 'technician', 'viewer']).withMessage('Role mus be either superadmin or admin'),
]

module.exports = {validateUser}