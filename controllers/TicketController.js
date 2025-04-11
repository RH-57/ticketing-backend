const prisma = require('../prisma/client')
const {validationResult} = require('express-validator')

const showAllTicket = async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany({
            select: {
                id: true,
                ticketNumber: true,
                title: true,
                createdAt: true,
                user: {
                    select: {
                        name: true
                    }
                },
                employee: {
                    select: {
                        name: true
                    }
                },
                priority: true,
                status: true
            },
            orderBy : {
                id: 'desc'
            }
        })

        res.status(200).send({
            status: true,
            message: 'All Ticket has been showed',
            data: tickets
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const priorityOrder = {
    Critical: 1,
    High: 2,
    Medium: 3,
    Low: 4
  }
  
const showOpenTicket = async (req, res) => {
    try {
        const showOpenTickets = await prisma.ticket.findMany({
            where: {
                status: {
                not: 'Closed'
                }
            },
            select: {
                ticketNumber: true,
                createdAt: true,
                title: true,
                employee: {
                    select: {
                        name: true
                    }
                },
                priority: true,
                    user: {
                    select: {
                        name: true
                    }
                },
                status: true,
            },
        });

        // Custom sort di sini
        showOpenTickets.sort((a, b) => {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        res.status(200).send({
            success: true,
            message: 'Get all open ticket',
            data: showOpenTickets
        });
    } catch (error) {
        res.status(500).send({
        success: false,
        message: 'Internal Server Error'
        });
    }
}

const searchTicket = async (req, res) => {
    const {query} = req.query
    if(!query) {
        return res.status(400).json({
            status: false,
            message: 'Query parameter required'
        })
    }

    try {
        const tickets = await prisma.ticket.findMany({
            where: {
                OR: [
                    {ticketNumber: {contains: query.toLowerCase()}},
                    {title: {contains: query.toLowerCase()}},
                    {employee: {
                        name: {contains: query.toLowerCase()
                    } }}
                ],
            },
            select: {
                ticketNumber: true,
                title: true,
                createdAt: true,
                user: {
                    select: {
                        name: true
                    }
                },
                employee: {
                    select: {
                        name: true
                    }
                },
                priority: true,
                status: true
            },
            orderBy: {
                id: 'desc'
            }
        })

        res.status(200).send({
            status: true,
            message: 'Search Result',
            data: tickets
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const showTicketById = async (req, res) => {
    const {ticketNumber} = req.params

    try {
        const tickets = await prisma.ticket.findUnique({
            where: {
                ticketNumber: ticketNumber
            },
            select: {
                id: true,
                ticketNumber: true,
                title: true,
                branch: {
                    select: {
                        code: true
                    }
                },
                division: {
                    select: {
                        name: true
                    }
                },
                department: {
                    select: {
                        name:true
                    }
                },
                employee: {
                    select: {
                        name: true
                    }
                },
                user: {
                    select: {
                        name: true
                    }
                },
                description: true,
                priority: true,
                status: true,
                closedAt: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        if(!tickets) {
            return res.status(404).send({
                status: false,
                message: 'Ticket not found'
            })
        }


        res.status(200).send({
            status: true,
            message: 'Get Ticket By Id',
            data: tickets
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const createTicket = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Validation Error",
            errors: errors.array(),
        });
    }

    try {
        const ticket = await prisma.$transaction(async (prisma) => {
            
            const newTicket = await prisma.ticket.create({
                data: {
                    title: req.body.title,
                    branchId: req.body.branchId,
                    divisionId: parseInt(req.body.divisionId),
                    departmentId: parseInt(req.body.departmentId),
                    employeeId: req.body.employeeId,
                    reportedById: req.body.reportedById,
                    description: req.body.description,
                    status: req.body.status || "Open",
                    priority: req.body.priority || "Medium",
                },
            });

            const ticketNumber = `IT-${newTicket.id}`;

            return await prisma.ticket.update({
                where: { id: newTicket.id },
                data: { ticketNumber },
            });
        });

        res.status(201).send({
            status: true,
            message: "New Ticket has been created",
            data: ticket,
        });
    } catch (error) {
        console.error("Error creating ticket:", error);
        
        if (error.code === "P2002") {
            return res.status(409).send({
                status: false,
                message: "Ticket creation conflict, please try again.",
            });
        }

        res.status(500).send({
            status: false,
            message: "Internal Server Error",
        });
    }
};

const updateTicket = async (req, res) => {
    const {id} = req.params
    const {status, priority, title, description} = req.body

    try {
        const tickets = await prisma.ticket.findUnique({
            where: {
                id: Number(id)
            }
        })

        if(!tickets) {
            return res.status(404).send({
                status: false,
                message: 'Ticket not found'
            })
        }

        const update = await prisma.ticket.update({
            where: {
                id: Number(id)
            },
            data: {
                status: status || tickets.status,
                priority: priority || tickets.priority,
                title: title || tickets.title,
                description: description || tickets.description,
            }
        })

        if (status === 'Closed') {
            update.closedAt = new Date()
        }
        
        res.status(200).send({
            status: true,
            message: 'Tiket has been updated',
            data: update
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const updateTicketStatus = async (req, res) => {
    const {ticketNumber} = req.params
    const {status} = req.body

    try {
        const ticket = await prisma.ticket.findUnique({
            where: {
                ticketNumber
            }
        })

        if(!ticket) {
            return res.status(404).send({
                success: false,
                message: 'Ticket tidak ditemukan'
            })
        }

        const validStatusTransitions = {
            Open: 'In_Progress',
            In_Progress: 'Resolved',
            Resolved: 'Closed'
        }

        if(!validStatusTransitions[ticket.status] || validStatusTransitions[ticket.status] !== status) {
            return res.status(400).send({
                success: false,
                message: `Invalid transition from ${ticket.status} to ${status}`
            })
        } 

        const updateTicket = await prisma.ticket.update({
            where: {
                ticketNumber
            },
            data: {
                status,
                closedAt: status === 'Closed' ? new Date() : null
            }
        })

        res.status(200).send({
            success: true,
            message: 'Ticket status updated',
            data: updateTicket
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const deleteTicket = async (req, res) => {
    const {id} = req.params

    try {
        const ticket = await prisma.ticket.findUnique({
            where: {
                id: Number(id)
            }
        })

        if(!ticket) {
            return res.status(404).send({
                status: false,
                message: 'Ticket not found'
            })
        }

        const deleteTicket = await prisma.ticket.delete({
            where: {
                id: Number(id)
            }
        })

        res.status(200).send({
            status: true,
            message: 'Ticket has been deleted'
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

const trendTicket = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear()
        const threeYearsAgo = [currentYear - 2, currentYear - 1, currentYear]

        const categories = await prisma.category.findMany({
            select: {
                name: true
            }
        })

        const trendData = threeYearsAgo.map(year => {
            let entry = {
                year: year.toString()
            }

            categories.forEach(cat => entry[cat.name] = 0)
            return entry
        })

        const tickets = await prisma.comment.findMany({
            where: {
                createdAt: {
                    gte: new Date(`${currentYear - 2}-01-01`),
                },
            },
            select: {
                createdAt: true,
                category: {
                    select: {
                        name: true
                    }
                }
            }
        })

        tickets.forEach(ticket => {
            const year = new Date(ticket.createdAt).getFullYear()
            const trendEntry = trendData.find(entry => entry.year === year.toString())
            if(trendEntry && ticket.category.name) {
                trendEntry[ticket.category.name] = (trendEntry[ticket.category.name] || 0) + 1
            }
        })
        res.status(200).send({
            success: true,
            message: 'Trend Tickets',
            data: trendData
        })
    } catch(error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const getTicketByCategory = async (req, res) => {
    try {
        const year = parseInt(req.params.year, 10)
        const month = parseInt(req.query.month, 10) // optional

        if (isNaN(year)) {
            return res.status(400).json({ success: false, message: 'Invalid year' })
        }

        let startDate = new Date(`${year}-01-01`)
        let endDate = new Date(`${year}-12-31`)

        if (!isNaN(month) && month >= 1 && month <= 12) {
            startDate = new Date(year, month - 1, 1)
            endDate = new Date(year, month, 0, 23, 59, 59)
        }

        const ticketsByCategory = await prisma.comment.groupBy({
            by: ["categoryId"],
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                }
            },
            _count: {
                id: true
            }
        })

        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true
            }
        })

        const formattedData = ticketsByCategory.map((t) => ({
            name: categories.find((c) => c.id === t.categoryId)?.name || "Unknown",
            ticketCount: t._count.id,
        }))

        res.status(200).send({
            success: true,
            message: 'Get Total Ticket by Category',
            data: formattedData
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
}

const getTicketBySubCategory = async (req, res) => {
    try {
        const year = parseInt(req.params.year, 10);
        const month = req.query.month;
        const categoryId = req.query.category_id;

        if (isNaN(year)) {
            return res.status(400).json({ success: false, message: 'Invalid year' });
        }

        const dateFilter = {
            gte: new Date(`${year}-${month || '01'}-01`),
            lte: new Date(`${year}-${month || '12'}-31`)
        };

        let subCategoryFilter = {};
        if (categoryId) {
            const subCats = await prisma.subCategory.findMany({
                where: { categoryId: parseInt(categoryId, 10) },
                select: { id: true }
            });
            const subCategoryIds = subCats.map((s) => s.id);
            subCategoryFilter = { subCategoryId: { in: subCategoryIds } };
        }

        const ticketBySubCategory = await prisma.comment.groupBy({
            by: ['subCategoryId'],
            where: {
                createdAt: dateFilter,
                ...subCategoryFilter
            },
            _count: { id: true }
        });

        const subCategories = await prisma.subCategory.findMany({ select: { id: true, name: true } });

        const formattedData = ticketBySubCategory.map((t) => ({
            name: subCategories.find((sub) => sub.id === t.subCategoryId)?.name || 'Unknown',
            ticket: t._count.id
        }));

        res.status(200).json({ success: true, message: 'Subcategory Chart', data: formattedData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const getTicketBySubSubCategory = async (req, res) => {
    try {
        const year = parseInt(req.params.year, 10)
        const month = parseInt(req.query.month, 10)
        const subCategoryId = req.query.subCategory_Id

        if (isNaN(year)) {
            return res.status(400).json({ success: false, message: 'Invalid year' })
        }

        let startDate = new Date(`${year}-01-01`)
        let endDate = new Date(`${year}-12-31`)
        if (!isNaN(month) && month >= 1 && month <= 12) {
            startDate = new Date(year, month - 1, 1)
            endDate = new Date(year, month, 0, 23, 59, 59)
        }

        let subSubCategoryFilter = {}
        if (subCategoryId) {
            const subSubCats = await prisma.subSubCategory.findMany({
                where: { subCategoryId: parseInt(subCategoryId, 10) },
                select: { id: true }
            })
            const subSubCategoryIds = subSubCats.map(s => s.id)
            if (subSubCategoryIds.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: 'No data for selected subcategory',
                    data: [],
                })
            }

            subSubCategoryFilter = {
                subSubCategoryId: { in: subSubCategoryIds },
            }
        }

        const ticketBySubSubCategory = await prisma.comment.groupBy({
            by: ['subSubCategoryId'],
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
                ...subSubCategoryFilter,
            },
            _count: {
                id: true,
            },
        })

        const subSubCategories = await prisma.subSubCategory.findMany({
            select: { id: true, name: true }
        })

        const formattedData = ticketBySubSubCategory.map((t) => ({
            name: subSubCategories.find(s => s.id === t.subSubCategoryId)?.name || 'Unknown',
            ticket: t._count.id,
        }))

        res.status(200).send({
            success: true,
            message: 'Get total ticket by SubSubCategory',
            data: formattedData,
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
}

module.exports = {
    showAllTicket, 
    showOpenTicket, 
    showTicketById, 
    createTicket, 
    updateTicket, 
    deleteTicket,  
    searchTicket, 
    updateTicketStatus, 
    trendTicket,
    getTicketByCategory,
    getTicketBySubCategory,
    getTicketBySubSubCategory,
}