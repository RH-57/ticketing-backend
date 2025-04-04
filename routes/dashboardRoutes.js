const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/DashboardController')
const verifyToken = require('../middlewares/auth')

router.get('/total-tickets', dashboardController.totalTicket)
router.get('/total-ticket-closed', dashboardController.totalTicketClosed)
router.get('/total-users', dashboardController.totalUser)
router.get('/total-employees', dashboardController.totalEmployee)
router.get('/total-branches', dashboardController.totalBranch)
router.get('/total-divisions', dashboardController.totalDivision)
router.get('/total-departments', dashboardController.totalDepartment)
router.get('/percentage-tickets', dashboardController.percentageTicket)
router.get('/most-active-departments', dashboardController.mostActiveDepartment)
router.get('/chart-internet', dashboardController.chartInternet)
router.get('/most-frequently-trouble-components', dashboardController.mostFrequentlyTroubleComponents)

module.exports = router