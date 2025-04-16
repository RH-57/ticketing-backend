const express = require('express')
const router = express.Router()
const subCategoryController = require('../controllers/SubCategoryController')
const {validateCategories} = require('../utils/validators/category')
const verifyToken = require('../middlewares/auth')
const role = require('../middlewares/role')

router.get('/:categoryId/sub-categories', verifyToken, subCategoryController.showSubCategoryByCategory) 
router.get('/:categoryId/sub-categories/:subCategoryId', verifyToken, subCategoryController.showSubCategoryById) 
router.post('/:categoryId/sub-categories', verifyToken, role(['admin', 'superadmin', 'technician']), validateCategories, subCategoryController.createSubCategory)
router.put('/:categoryId/sub-categories/:subCategoryId', role(['admin', 'superadmin', 'technician']), verifyToken, validateCategories, subCategoryController.updateSubCategory)
router.delete('/:categoryId/sub-categories/:subCategoryId', role(['admin', 'superadmin', 'technician']), verifyToken, subCategoryController.deleteSubCategory)


module.exports = router