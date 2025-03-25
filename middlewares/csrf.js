const csrf = require('csrf');
const tokens = new csrf();

const generateCsrfToken = (req, res) => {
    const secret = tokens.secretSync();
    const token = tokens.create(secret);

    // Simpan token di cookie agar bisa digunakan di frontend
    res.cookie('csrfToken', token, { httpOnly: true, secure: false }); // Set secure: true jika pakai HTTPS
    res.json({ csrfToken: token });
};

const verifyCsrfToken = (req, res, next) => {
    const token = req.headers['csrf-token']; // Ambil token dari header
    const csrfTokenCookie = req.cookies.csrfToken; // Ambil token dari cookie

    if (!csrfTokenCookie || csrfTokenCookie !== token) {
        return res.status(403).json({ status: false, message: 'Invalid CSRF Token' });
    }

    next();
};

module.exports = { generateCsrfToken, verifyCsrfToken };