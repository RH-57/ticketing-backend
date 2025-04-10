const prisma = require('../prisma/client')
const {validationResult} = require('express-validator')

const showComment = async (req, res) => {
    const {ticketId}= req.params

    try {
        const comment = await prisma.comment.findMany({
            where: {
                ticketId:  parseInt(ticketId)
            },
            select: {
                id: true,
                category: {
                    select: {
                        name: true
                    }
                },
                subCategory: {
                    select: {
                        name: true
                    }
                },
                subSubCategory: {
                    select: {
                        name: true
                    }
                },
                type: true,
                description: true,
                user: {
                    select: {
                        name: true
                    }
                },
                createdAt: true
            }
        })

        res.status(200).send({
            status: true,
            message: 'Comment by Ticket Number',
            data: comment
        })
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).send({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}


const addComment = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        console.log("Validation Errors:", errors.array());
        return res.status(422).json({
            success: false,
            message: 'Validation Error',
            errors: errors.array()
        })
    }

    try {
        const {ticketId, categoryId, subCategoryId, subSubCategoryId, userId, type, description} = req.body

        const ticket = await prisma.ticket.findUnique({
            where: {
                id: parseInt(ticketId)
            }
        })

        if(!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            })
        }

        if(ticket.status !== 'Resolved') {
            return res.status(400).json({
                success: false,
                message: 'Ticket not resolved'
            })
        }

        const newComment = await prisma.comment.create({
            data: {
                ticketId: parseInt(ticketId),
                userId: parseInt(userId),
                categoryId: parseInt(categoryId),
                subCategoryId: parseInt(subCategoryId),
                subSubCategoryId: parseInt(subSubCategoryId),
                type,
                description
            }
        })

        res.status(201).send({
            success: true,
            message: 'Comment has been added',
            data: newComment
        })
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const showTotalReportByType = async (req, res) => {
    try {
        const totalReport = await prisma.comment.findMany({
            select: { type: true }
        });

        const formattedStats = totalReport.reduce((acc, comment) => {
            acc[comment.type] = (acc[comment.type] || 0) + 1;
            return acc;
        }, {});

        const formattedResponse = Object.keys(formattedStats).map(type => ({
            type,
            total: formattedStats[type]
        }));

        res.status(200).json({
            success: true,
            message: "Get total report by Type",
            data: formattedResponse
        });
    } catch (error) {
        console.error("Error fetching total report:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const mostProductiveUser = async (req, res) => {
    try {
        const result = await prisma.comment.groupBy({
            by: [
                'userId'
            ],
            _count: {
                userId: true
            },
            orderBy: {
                _count: {
                    userId: 'desc'
                }
            },
            take: 4
        })

        const userIds = result.map(item => item.userId)
        const users = await prisma.user.findMany({
            where: {
                id: {
                    in: userIds
                }
            },
            select: {
                id: true,
                name: true,
            }
        })

        const response = result.map(item => {
            const user = users.find(u => u.id === item.userId)
            return {
                user_id: item.userId,
                name: user?.name || 'Unknown',
                total_comments: item._count.userId,
            }
        })

        res.status(200).send({
            success: true,
            message: 'Most Productive User',
            data: response
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}


module.exports = {addComment, showComment, showTotalReportByType, mostProductiveUser}