require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.use(express.json());
app.use(express.static('public')); // Тут лежатимуть твої HTML/CSS

// Маршрут для логіну
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (result.rows.length > 0) {
            const user = result.rows[0];

            const match = await bcrypt.compare(password, user.password_hash);

            if (match) {
                res.json({ success: true, user: user });
            } else {
                res.status(401).json({ success: false, message: 'Невірний пароль' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Користувача не знайдено' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Помилка сервера');
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Сервер запущено на http://localhost:${process.env.PORT}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер працює на порту ${PORT}`);
});