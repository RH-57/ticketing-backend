const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173', // Sesuaikan dengan URL frontend (React)
    credentials: true, // Izinkan cookies dikirim dari frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Izinkan metode HTTP tertentu
    allowedHeaders: ['Content-Type', 'Authorization', 'csrf-token'], // Izinkan header tertentu
}));