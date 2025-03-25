const express = require('express')
const router = express.Router()
const employeeController = require('../controllers/EmployeeController')
const {validateEmployee} = require('../utils/validators/employee')
const verifyToken = require('../middlewares/auth')

router.get('/', verifyToken, employeeController.showEmployee)
router.post('/', verifyToken, validateEmployee, employeeController.createEmployee)
router.put('/:id', verifyToken, validateEmployee, employeeController.updateEmployee)
router.delete('/:id', verifyToken, employeeController.deleteEmployee)
router.get('/search', verifyToken, employeeController.searchEmployee)
router.get('/department', verifyToken, employeeController.getEmployeeByDepartmentId)

module.exports = router