const express = require('express')
const router = express.Router()

const registerController = require('../controllers/RegisterController')
const loginController = require('../controllers/LoginController')

const branchRoutes = require('./branchRoutes')
const userRoutes = require('./userRoutes')
const employeeRoutes = require('./employeeRoutes')
const categoryRoutes = require('./categoryRoutes')
const subCategoryRoutes = require('./subCategoryRoutes')
const subSubCategoryRoutes = require('./subSubCategoryRoutes')
const priorityRoutes = require('./priorityRoutes')
const problemRoutes = require('./problemRoutes')
const ticketRoutes = require('./ticketRoutes')
const deptRoutes = require('./deptRoutes')
const commentRoutes = require('./commentRoutes')
const dashboardRoutes = require('./dashboardRoutes')
const divisionRoutes = require('./divisionRoutes')
const {validateRegister, validateLogin} = require('../utils/validators/auth')
const role = require('../middlewares/role')
const verifyToken = require('../middlewares/auth')


router.post('/register', validateRegister, registerController.register)
router.post('/login', validateLogin, loginController.login)

router.use('/admin/dashboards', verifyToken, dashboardRoutes)

router.use('/admin/users', verifyToken, userRoutes)
router.use('/admin/branches', verifyToken, branchRoutes)
router.use('/admin/employees', verifyToken, employeeRoutes)
router.use('/admin/categories', verifyToken, categoryRoutes)
router.use('/admin/categories', verifyToken, subCategoryRoutes)
router.use('/admin/sub-categories', verifyToken, subSubCategoryRoutes)
router.use('/admin/priorities', verifyToken, priorityRoutes)
router.use('/admin/problems', verifyToken, problemRoutes)
router.use('/admin/tickets', ticketRoutes)
router.use('/admin/departments', verifyToken, deptRoutes)
router.use('/admin/comments', commentRoutes)
router.use('/admin/divisions', divisionRoutes)

module.exports = router