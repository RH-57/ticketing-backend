const {body} = require('express-validator')
const prisma = require('../../prisma/client')

const validatePriority = [
    body('name').notEmpty().isLength({min: 3}).withMessage('Priority Name is required with min 3 char!')
]

module.exports = {validatePriority}