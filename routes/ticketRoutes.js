const express = require('express')
const router = express.Router()
const ticketController = require('../controllers/TicketController')
const detailTrendController = require('../controllers/DetailTrendController')
const {validateTicket} = require('../utils/validators/ticket')
const verifyToken = require('../middlewares/auth')
const {verifyCsrfToken} = require('../middlewares/csrf')
const role = require('../middlewares/role')

router.get('/', verifyToken, ticketController.showAllTicket)
router.get('/open-tickets', ticketController.showOpenTicket)
router.get('/trend', ticketController.trendTicket)
router.get('/detail-trend/:year', detailTrendController.getTicketTrendByYear)
router.get('/trend-categories/:year', ticketController.getTicketByCategory)
router.get('/trend-sub-categories/:year', ticketController.getTicketBySubCategory)
router.get('/trend-sub-sub-categories/:year', ticketController.getTicketBySubSubCategory)
router.get('/search', verifyToken, ticketController.searchTicket)
router.get('/:ticketNumber', verifyToken, ticketController.showTicketById)
router.post('/', verifyToken, verifyCsrfToken,role(['admin', 'superadmin', 'technician']), validateTicket, ticketController.createTicket)
router.put('/:id', verifyToken, verifyCsrfToken, role(['admin', 'superadmin', 'technician']), validateTicket, ticketController.updateTicket)
router.delete('/:id', verifyToken, verifyCsrfToken, role(['admin', 'superadmin', 'technician']), validateTicket, ticketController.deleteTicket)
router.patch('/:ticketNumber/status', verifyToken, role(['admin', 'superadmin', 'technician']), verifyCsrfToken, ticketController.updateTicketStatus)



module.exports = router