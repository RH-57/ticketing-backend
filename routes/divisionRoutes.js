const express = require('express')
const router = express.Router()
const divisionController = require('../controllers/DivisionController')
const {validateDivision} = require('../utils/validators/division')
const verifyToken = require('../middlewares/auth')
const {verifyCsrfToken} = require('../middlewares/csrf')
const role = require('../middlewares/role')

router.get('/', verifyToken, divisionController.showDivision)
router.post('/', verifyToken, role(['admin', 'superadmin', 'technician']),  validateDivision, divisionController.createDivision)
router.put('/:id', verifyToken, role(['admin', 'superadmin', 'technician']),  divisionController.updateDivision)
router.delete('/:id', verifyToken, role(['admin', 'superadmin', 'technician']),  divisionController.deleteDivision)
router.get('/search', verifyToken, divisionController.searchDivision)
router.get('/branch', verifyToken, divisionController.getDivisionByBranchId)

module.exports = router