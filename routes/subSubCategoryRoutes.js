const express = require('express')
const router = express.Router()
const subSubCategoryController = require('../controllers/SubSubCategoryController')
const {validateCategories} = require('../utils/validators/category')
const verifyToken = require('../middlewares/auth')
const role = require('../middlewares/role')

router.get('/:subCategoryId/sub-sub-categories', verifyToken, subSubCategoryController.showSubSubCategoryByCategoryId) 
router.post('/:subCategoryId/sub-sub-categories', verifyToken, role(['admin', 'superadmin', 'technician']), validateCategories, subSubCategoryController.createSubSubCategory)
router.put('/:subCategoryId/sub-sub-categories/:subSubCategoryId', role(['admin', 'superadmin', 'technician']), verifyToken, validateCategories, subSubCategoryController.updateSubSubCategory)
router.delete('/:subCategoryId/sub-sub-categories/:subSubCategoryId', role(['admin', 'superadmin', 'technician']), verifyToken, subSubCategoryController.deleteSubSubCategory)


module.exports = router