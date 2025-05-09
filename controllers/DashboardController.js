const prisma = require('../prisma/client')

const totalTicket = async (req, res) => {
    try {
        const totalTickets = await prisma.ticket.count()
        res.status(200).send({
            success: true,
            message: 'Get Total Tickets',
            data: totalTickets
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const totalUser = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count()
        res.status(200).send({
            success: true,
            message: 'Get all users',
            data: totalUsers
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const totalTicketClosed = async (req, res) => {
    const year = parseInt(req.query.year)
  
    try {
      const whereClause = {
        status: 'Closed',
      }
  
      if (!isNaN(year)) {
        whereClause.closedAt = {
          gte: new Date(`${year}-01-01T00:00:00.000Z`),
          lte: new Date(`${year}-12-31T23:59:59.999Z`)
        }
      }
  
      const totalTickets = await prisma.ticket.count({
        where: whereClause
      })
  
      res.status(200).send({
        success: true,
        message: 'Get Total Ticket Closed',
        data: totalTickets
      })
    } catch (error) {
      res.status(500).send({
        success: false,
        message: 'Internal Server Error'
      })
    }
  }

const getTotalTicket = async () => {
    return await prisma.ticket.count()
}

// Fungsi untuk mengambil jumlah tiket berstatus 'Closed' (hanya return angka)
const getTotalTicketClosed = async () => {
    return await prisma.ticket.count({
        where: { status: 'Closed' }
    })
}

const percentageTicket = async (req, res) => {
    try {
        const totalTickets = await getTotalTicket()
        const closedTicket = await getTotalTicketClosed()
        const percentage = totalTickets > 0
            ? ((closedTicket / totalTickets) * 100).toFixed(1)
            : 0
        
        res.status(200).send({
            success: true,
            message: 'Get percentage Ticket Closed',
            data: `${percentage}%`
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const totalEmployee = async (req, res) => {
    try {
        const totalEmployees = await prisma.employee.count()
        res.status(200).send({
            success: true,
            message: 'Get all employee',
            data: totalEmployees
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const totalBranch = async (req, res) => {
    try {
        const totalBranches = await prisma.branch.count()
        res.status(200).send({
            success: true,
            message: 'Get all branches',
            data: totalBranches
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const totalDivision = async (req, res) => {
    try {
        const totalDivisions = await prisma.division.count()
        res.status(200).send({
            success: true,
            message: 'Get total Division',
            data: totalDivisions
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}
const totalDepartment = async (req, res) => {
    try {
        const totalDepartments = await prisma.department.count()
        res.status(200).send({
            success: true,
            message: 'Get total department',
            data: totalDepartments
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const mostActiveDepartment = async (req, res) => {
    try {
        const activeDepartment = await prisma.ticket.groupBy({
            by: ['departmentId'],
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            },
        })

        const departmentData = await Promise.all(
            activeDepartment.map(async (dept) => {
                const department = await prisma.department.findUnique({
                    where: { id: dept.departmentId },
                    select: { name: true }
                });

                return {
                    department: department?.name || 'Unknown', 
                    totalTickets: dept._count.id
                };
            })
        );
    
        res.status(200).send({
            succees: true,
            message: 'Get most active department',
            data: departmentData
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'internal Server error'
        })
    }
}

const mostFrequentlyTroubleComponents = async (req, res) => {
    try {
        const troubleComponents = await prisma.comment.groupBy({
            by: ['subSubCategoryId'],
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            },
        })
        const subSubcategoryData = await Promise.all(
            troubleComponents.map(async (subSubCat) => {
                const subSubCategories = await prisma.subSubCategory.findUnique({
                    where: {
                        id: subSubCat.subSubCategoryId,
                    },
                    select: {
                        name: true,
                    }
                })

                return {
                    subSubCategories: subSubCategories?.name || 'Unknown',
                    totalReport: subSubCat._count.id
                }
            })
        )

        res.status(200).send({
            success: true,
            message: 'Get most frequently trouble components',
            data: subSubcategoryData
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const chartInternet = async (req, res) => {
    try {
        // Ambil tahun saat ini
        const currentYear = new Date().getFullYear();
        const threeYearsAgo = currentYear - 2; // Mengambil data dari 3 tahun terakhir

        const internetTickets = await prisma.comment.groupBy({
            by: ['subSubCategoryId'],
            _count: { id: true },
            where: {
                subCategory: { name: "Internet" },
                createdAt: {
                    gte: new Date(`${threeYearsAgo}-01-01T00:00:00.000Z`) // Ambil dari 3 tahun terakhir
                }
            }
        });

        // Ambil data sub-sub kategori
        const subSubCategories = await prisma.subSubCategory.findMany({
            select: { id: true, name: true }
        });

        // Ambil data per tahun
        const yearlyTickets = await prisma.comment.groupBy({
            by: ['subSubCategoryId', 'createdAt'],
            _count: { id: true },
            where: {
                subCategory: { name: "Internet" },
                createdAt: {
                    gte: new Date(`${threeYearsAgo}-01-01`)
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Format data
        const formattedData = yearlyTickets.map(item => {
            const subSubCategory = subSubCategories.find(subSubCat => subSubCat.id === item.subSubCategoryId);
            return {
                year: new Date(item.createdAt).getFullYear(),
                subSubCategory: subSubCategory ? subSubCategory.name : "Unknown",
                total: item._count.id
            };
        });

        res.status(200).send({
            success: true,
            message: 'Total Internet Ticket per Year',
            data: formattedData
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

module.exports = {
    totalTicket, 
    totalUser, 
    totalTicketClosed, 
    totalEmployee, 
    totalBranch, 
    totalDivision,
    totalDepartment, 
    percentageTicket, 
    mostActiveDepartment,
    mostFrequentlyTroubleComponents,
    chartInternet,
}