const {body} = require('express-validator')
const prisma = require('../../prisma/client')

const validateCategories = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({min:2, max: 30}).withMessage('Name must be between 2-30 characters'),
]

module.exports = {validateCategories}