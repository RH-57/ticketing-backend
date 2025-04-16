const express = require('express')
const router = express.Router()
const branchController = require('../controllers/BranchController')
const {validateBranch} = require('../utils/validators/branch')
const verifyToken = require('../middlewares/auth')
const {verifyCsrfToken} = require('../middlewares/csrf')
const role = require('../middlewares/role')

router.get('/', verifyToken, branchController.showBranch)
router.post('/', verifyToken, role(['admin', 'superadmin', 'technician']), verifyCsrfToken, validateBranch, branchController.createBranch)
router.put('/:id', verifyToken, role(['admin', 'superadmin', 'technician']), verifyCsrfToken, validateBranch, branchController.updateBranch)
router.delete('/:id', verifyToken, role(['admin', 'superadmin', 'technician']), verifyCsrfToken, branchController.deleteBranch)
router.get('/search', verifyToken, branchController.searchBranch)

module.exports = router