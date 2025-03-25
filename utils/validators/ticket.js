const {body} = require('express-validator')
const prisma = require('../../prisma/client')

const validateTicket = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title must be a string'),
    body('description')
        .notEmpty().withMessage('Description is required')
        .isString().withMessage('Description must be a string'),
    body('branchId')
        .notEmpty().withMessage('Branch ID is required')
        .isInt().withMessage('Branch ID must be an integer')
        .toInt()
        .custom(async (branchId) => {
            const branch = await prisma.branch.findUnique({ where: { id: branchId } });
            if (!branch) {
                throw new Error('Branch ID does not exist');
            }
        }),
    body('employeeId')
        .notEmpty().withMessage('Employee ID is required')
        .isInt().withMessage('Employee ID must be an integer')
        .toInt()
        .custom(async (employeeId) => {
            const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
            if (!employee) {
                throw new Error('Employee ID does not exist');
            }
        }),
    body('reportedById')
        .notEmpty().withMessage('Reporter is required')
        .isInt().withMessage('ReportedBy ID must be an integer')
        .toInt()
        .custom(async (reportedById) => {
            const user = await prisma.user.findUnique({ where: { id: reportedById } });
            if (!user) {
                throw new Error('User does not exist!');
            }
        }),
    body('status')
        .optional()
        .isIn(['Open', 'In_Progress', 'Resolved', 'Closed'])
        .withMessage('Invalid status'),

    body('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High', 'Critical'])
        .withMessage('Invalid priority'),
]

module.exports = {validateTicket}