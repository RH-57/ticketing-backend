const express = require('express')
const router = express.Router()
const divisionController = require('../controllers/DivisionController')
const {validateDivision} = require('../utils/validators/division')
const verifyToken = require('../middlewares/auth')
const {verifyCsrfToken} = require('../middlewares/csrf')

router.get('/', verifyToken, divisionController.showDivision)
router.post('/', verifyToken, validateDivision, divisionController.createDivision)
router.put('/:id', verifyToken, divisionController.updateDivision)
router.delete('/:id', verifyToken, divisionController.deleteDivision)
router.get('/search', verifyToken, divisionController.searchDivision)
router.get('/branch', verifyToken, divisionController.getDivisionByBranchId)

module.exports = router