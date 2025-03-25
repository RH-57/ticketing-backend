const prisma = require('../prisma/client')

const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true
            }
        })

        res.json({
            success: true,
            data: categories
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const getTicketTrendByYear = async (req, res) => {
    try {
        const year = parseInt(req.params.year, 10)
        const categoryId = req.query.categoryId ? parseInt(req.query.categoryId, 10) : null
        const typeFilter = req.query.type || null

        if (isNaN(year)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid year'
            })
        }

        // Membuat filter pencarian
        const whereClause = {
            createdAt: {
                gte: new Date(`${year}-01-01T00:00:00.000Z`),
                lte: new Date(`${year}-12-31T23:59:59.999Z`)
            }
        }

        if (categoryId) {
            whereClause.categoryId = categoryId
        }

        if (typeFilter) {
            whereClause.type = typeFilter
        }

        // Mengambil data komentar sesuai filter
        const comments = await prisma.comment.findMany({
            where: whereClause,
            select: {
                createdAt: true
            }
        })

        // Menghitung jumlah tiket per bulan
        const monthlyData = Array(12).fill(0)
        comments.forEach(comment => {
            const month = new Date(comment.createdAt).getMonth()
            monthlyData[month] += 1
        })

        // Format hasil dalam bentuk bulan & jumlah tiket
        const formattedData = monthlyData.map((count, index) => ({
            month: new Date(2000, index, 1).toLocaleString('default', { month: 'short' }),
            ticket: count
        }))

        res.json({
            success: true,
            message: `Ticket trend for ${year}`,
            data: formattedData
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

module.exports = { getTicketTrendByYear, getCategories }