const  {body} = require('express-validator')
const prisma = require('../../prisma/client')

const validateComment = [
    body('ticketId')
        .notEmpty().withMessage('Ticket Wajid Diisi')
        .isInt().withMessage('Ticket ID harus berupa angka'),
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
    body('type')
        .isIn(['Malfunction', 'Human_Error', 'Other'])
        .withMessage('Tipe comment tidak valid'),
    body('description')
        .notEmpty().withMessage('Deskripsi wajib diisi')
        .isString().withMessage('Deskripsi harus berupa text')
        .isLength({max: 500}).withMessage('Deskripsi maksimal 500 karakter')
]

module.exports = {validateComment}