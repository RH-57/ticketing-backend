const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/DashboardController')
const verifyToken = require('../middlewares/auth')
const role = require('../middlewares/role')

router.get('/total-tickets', role(['viewer', 'admin', 'superadmin', 'technician']), dashboardController.totalTicket)
router.get('/total-ticket-closed', role(['viewer', 'admin', 'superadmin', 'technician']), dashboardController.totalTicketClosed)
router.get('/total-users',role(['viewer', 'admin', 'superadmin', 'technician']), dashboardController.totalUser)
router.get('/total-employees',role(['viewer', 'admin', 'superadmin', 'technician']), dashboardController.totalEmployee)
router.get('/total-branches',role(['viewer', 'admin', 'superadmin', 'technician']), dashboardController.totalBranch)
router.get('/total-divisions',role(['viewer', 'admin', 'superadmin', 'technician']), dashboardController.totalDivision)
router.get('/total-departments',role(['viewer', 'admin', 'superadmin', 'technician']), dashboardController.totalDepartment)
router.get('/percentage-tickets',role(['viewer', 'admin', 'superadmin', 'technician']), dashboardController.percentageTicket)
router.get('/most-active-departments',role(['viewer', 'admin', 'superadmin', 'technician']), dashboardController.mostActiveDepartment)
router.get('/chart-internet',role(['viewer', 'admin', 'superadmin', 'technician']), dashboardController.chartInternet)
router.get('/most-frequently-trouble-components',role(['viewer', 'admin', 'superadmin', 'technician']), dashboardController.mostFrequentlyTroubleComponents)

module.exports = router