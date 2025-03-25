const {body} = require('express-validator')
const prisma = require('../../prisma/client')

const validateDept = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .custom(async (value, { req }) => {
            if (!value) {
                throw new Error("Name is required");
            }

            const existingDept = await prisma.department.findFirst({
                where: {
                    name: value,
                    divisionId: Number(req.body.divisionId),
                },
            });

            if (existingDept) {
                throw new Error("Department with this name already exists in the selected division");
            }

            return true;
        }),
]

module.exports = {validateDept}