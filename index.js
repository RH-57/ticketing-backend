const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const router = require('./routes')

const app = express()
const { generateCsrfToken, verifyCsrfToken } = require('./middlewares/csrf');

app.use(cors({
    origin: ['http://192.168.1.185:5173', 'http://localhost:5173'], // Ganti sesuai alamat frontend
    credentials: true, // Izinkan credentials seperti cookies dan headers
}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())


const port = 3000

app.get('/api/csrf-token', generateCsrfToken);


app.use('/api', router)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})