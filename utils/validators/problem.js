const {body} = require('express-validator')
const prisma = require('../../prisma/client')

const validateProblem = [
    body('categoryId')
        .notEmpty().withMessage('Category is Required')
        .isInt().withMessage('Must Integer')
        .toInt()
        .custom(async (categoryId) => {
            const category = await prisma.category.findUnique({where: {id: categoryId}})
            if(!category) {
                throw new Error('Category does not exists!')
            }
        }),
        body('subCategoryId')
        .notEmpty().withMessage('Sub-Category is Required')
        .isInt().withMessage('SubCategory ID must be an integer')
        .toInt()
        .custom(async (subCategoryId) => {
            if (subCategoryId) {
                const subCategory = await prisma.subCategory.findUnique({ where: { id: subCategoryId } });
                if (!subCategory) {
                    throw new Error('SubCategory ID does not exist');
                }
            }
        }),

    body('subSubCategoryId')
        .notEmpty().withMessage('Sub-SUb-Category is Required')
        .isInt().withMessage('SubSubCategory ID must be an integer')
        .toInt()
        .custom(async (subSubCategoryId) => {
            if (subSubCategoryId) {
                const subSubCategory = await prisma.subSubCategory.findUnique({ where: { id: subSubCategoryId } });
                if (!subSubCategory) {
                    throw new Error('SubSubCategory ID does not exist');
                }
            }
        }),

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

    body('userId')
        .notEmpty().withMessage('User ID is required')
        .isInt().withMessage('User ID must be an integer')
        .toInt()
        .custom(async (userId) => {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new Error('User ID does not exist');
            }
        }),

    body('detail_report')
        .optional()
        .isString().withMessage('Detail report must be a string')
        .isLength({ max: 500 }).withMessage('Detail report must be at most 500 characters'),

    body('detail_problem')
        .optional()
        .isString().withMessage('Detail problem must be a string')
        .isLength({ max: 500 }).withMessage('Detail problem must be at most 500 characters'),

    body('detail_solution')
        .optional()
        .isString().withMessage('Detail solution must be a string')
        .isLength({ max: 500 }).withMessage('Detail solution must be at most 500 characters'),

    body('reportedAt')
        .notEmpty().withMessage('Reported date is required')
        .isISO8601().withMessage('Reported date must be a valid date format')
]

module.exports = {validateProblem}