const {body} = require('express-validator')
const prisma = require('../../prisma/client')

const validateEmployee = [
    body('name')
        .notEmpty().withMessage('Name required')
        .isString().withMessage('Name must be a string')
        .isLength({ min: 3, max: 50}).withMessage('Name must be between 3-50 characters'),
    body('branchId')
        .notEmpty().withMessage('Name required')
        .isInt().withMessage('Branch must be an integer')
        .toInt()
        .custom(async (branchId) => {
            const branch = await prisma.branch.findUnique({ where: {id: branchId}})
            if(!branch) {
                throw new Error('Branch ID Does Not Exists')
            }
        }),
]

module.exports = {validateEmployee}