const express = require('express')
const router = express.Router()
const commentController = require('../controllers/CommentController')
const {validateComment} = require('../utils/validators/comment')
const verifyToken = require('../middlewares/auth')
const role = require('../middlewares/role')

router.get('/most-productive-users', commentController.mostProductiveUser)
router.get('/total-by-subcategories', commentController.showTotalReportBySubCategory)
router.get('/total-by-subsubcategories', commentController.showTotalReportBySubSubCategory)
router.get('/compare', commentController.compareSubcategoryByErrorType)
router.get('/show-total-report-by-type', commentController.showTotalReportByType)
router.get('/:ticketId', commentController.showComment)
router.post('/', verifyToken, role(['admin', 'superadmin', 'technician']), validateComment, commentController.addComment)


module.exports = router