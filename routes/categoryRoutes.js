const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/CategoryController')
const {validateCategories} = require('../utils/validators/category')
const verifyToken = require('../middlewares/auth')
const role = require('../middlewares/role')

router.get('/', verifyToken, categoryController.showCategories) 
router.get('/:id', verifyToken, categoryController.showCategoryById) 
router.post('/', verifyToken, role(['admin', 'superadmin', 'technician']), validateCategories, categoryController.createCategories)  
router.put('/:id', verifyToken, role(['admin', 'superadmin', 'technician']), validateCategories, categoryController.updateCategories)  
router.delete('/:id', verifyToken, role(['admin', 'superadmin', 'technician']), categoryController.deleteCategories)


module.exports = router