const express = require('express')
const router = express.Router()
const employeeController = require('../controllers/EmployeeController')
const {validateEmployee} = require('../utils/validators/employee')
const verifyToken = require('../middlewares/auth')
const role = require('../middlewares/role')

router.get('/', verifyToken, employeeController.showEmployee)
router.post('/', verifyToken, role(['admin', 'superadmin', 'technician']), validateEmployee, employeeController.createEmployee)
router.put('/:id', verifyToken, role(['admin', 'superadmin', 'technician']), validateEmployee, employeeController.updateEmployee)
router.delete('/:id', verifyToken, role(['admin', 'superadmin', 'technician']), employeeController.deleteEmployee)
router.get('/search', verifyToken, employeeController.searchEmployee)
router.get('/department', verifyToken, employeeController.getEmployeeByDepartmentId)

module.exports = router