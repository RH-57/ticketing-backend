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
        const typeFilter = req.query.type || null

        if (isNaN(year)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid year'
            })
        }

        // Query semua kategori
        const categories = await prisma.category.findMany({
            select: { id: true, name: true }
        })

        const dataPerCategory = []

        for (const category of categories) {
            const whereClause = {
                createdAt: {
                    gte: new Date(`${year}-01-01T00:00:00.000Z`),
                    lte: new Date(`${year}-12-31T23:59:59.999Z`)
                },
                categoryId: category.id
            }

            if (typeFilter) {
                whereClause.type = typeFilter
            }

            const comments = await prisma.comment.findMany({
                where: whereClause,
                select: {
                    createdAt: true
                }
            })

            const monthlyData = Array(12).fill(0)
            comments.forEach(comment => {
                const month = new Date(comment.createdAt).getMonth()
                monthlyData[month] += 1
            })

            dataPerCategory.push({
                category: category.name,
                monthlyData
            })
        }

        // Gabungkan data ke bentuk { month: 'Jan', Hardware: x, Software: y }
        const finalData = Array.from({ length: 12 }, (_, index) => {
            const monthName = new Date(2000, index, 1).toLocaleString('default', { month: 'short' })
            const monthObj = { month: monthName }

            dataPerCategory.forEach(entry => {
                monthObj[entry.category] = entry.monthlyData[index]
            })

            return monthObj
        })

        res.json({
            success: true,
            message: `Ticket trend for ${year}`,
            data: finalData
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