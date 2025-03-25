const express = require('express')
const router = express.Router()
const commentController = require('../controllers/CommentController')
const {validateComment} = require('../utils/validators/comment')
const verifyToken = require('../middlewares/auth')

router.get('/show-total-report-by-type', commentController.showTotalReportByType)
router.get('/:ticketId', commentController.showComment)
router.post('/', verifyToken, validateComment, commentController.addComment)

module.exports = router