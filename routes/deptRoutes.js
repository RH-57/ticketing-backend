const express = require('express')
const router = express.Router()
const deptController = require('../controllers/DeptController')
const {validateDept} = require('../utils/validators/dept')
const verifyToken = require('../middlewares/auth')
const {verifyCsrfToken} = require('../middlewares/csrf')
const role = require('../middlewares/role')

router.get('/', verifyToken, deptController.showDept)
router.post('/', verifyCsrfToken, verifyToken, role(['admin', 'superadmin', 'technician']), validateDept, deptController.createDept)
router.put('/:id', verifyCsrfToken, verifyToken, role(['admin', 'superadmin', 'technician']), validateDept, deptController.updateDept)
router.delete('/:id', verifyCsrfToken, verifyToken, role(['admin', 'superadmin', 'technician']), validateDept, deptController.deleteDept)
router.get('/search', verifyToken, deptController.searchDept)
router.get('/division', verifyToken, deptController.getDepartmentByDivisionId)


module.exports = router