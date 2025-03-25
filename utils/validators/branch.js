const {body} = require('express-validator')
const prisma = require('../../prisma/client')

const validateBranch = [
    body('code')
        .notEmpty().withMessage('Code is required')
        .custom(async (value, {req}) => {
            if(!value) {
                throw new Error('Code is required')
            }

            return true
        }),
    body('name').notEmpty().withMessage('Branch Name is Required'),
]

module.exports = {validateBranch}