const express = require('express')
const router = express.Router()
const branchController = require('../controllers/BranchController')
const {validateBranch} = require('../utils/validators/branch')
const verifyToken = require('../middlewares/auth')
const {verifyCsrfToken} = require('../middlewares/csrf')

router.get('/', verifyToken, branchController.showBranch)
router.post('/', verifyToken, verifyCsrfToken, validateBranch, branchController.createBranch)
router.put('/:id', verifyToken, verifyCsrfToken, validateBranch, branchController.updateBranch)
router.delete('/:id', verifyToken, verifyCsrfToken, branchController.deleteBranch)
router.get('/search', verifyToken, branchController.searchBranch)

module.exports = router