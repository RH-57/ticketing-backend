const express = require('express')
const router = express.Router()
const deptController = require('../controllers/DeptController')
const {validateDept} = require('../utils/validators/dept')
const verifyToken = require('../middlewares/auth')
const {verifyCsrfToken} = require('../middlewares/csrf')

router.get('/', verifyToken, deptController.showDept)
router.post('/', verifyCsrfToken, verifyToken, validateDept, deptController.createDept)
router.put('/:id', verifyCsrfToken, verifyToken, validateDept, deptController.updateDept)
router.delete('/:id', verifyCsrfToken, verifyToken, validateDept, deptController.deleteDept)
router.get('/search', verifyToken, deptController.searchDept)
router.get('/division', verifyToken, deptController.getDepartmentByDivisionId)


module.exports = router