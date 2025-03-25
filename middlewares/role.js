const { user } = require("../prisma/client")

const role = (roles) => {
    return (req, res, next) => {
        if(!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: You dont have permission to access this resource'
            })
        }

        next()
    }
}

module.exports = role