const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const SECRET_KEY = '19120700'; // Thay thế bằng khóa bí mật thực tế

const users = [
    { id: 1, username: 'user1', password: '123' },
    { id: 2, username: 'user2', password: 'password2' },
];

// API đăng nhập
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY);
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Đăng nhập không hợp lệ' });
    }
});

// API xác thực
app.post('/authenticate', (req, res) => {
    const token = req.body.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            res.json({ user: decoded });
        } catch (error) {
            res.status(401).json({ message: 'Token không hợp lệ' });
        }
    } else {
        res.status(401).json({ message: 'Token không được cung cấp' });
    }
});

// API trả về thông tin người dùng đã xác thực
app.get('/user-info', authenticateToken, (req, res) => {
    // Người dùng đã xác thực và có thông tin trong req.user
    res.json({ info: req.user });
});

// Đoạn mã xử lý đường dẫn "/login-popup"
app.get('/login-popup', (req, res) => {
    res.sendFile(__dirname + '/login-popup.html');
});


function authenticateToken(req, res, next) {
    // Lấy header Authorization từ yêu cầu
    const authHeader = req.headers['authorization'];
    // Tách token từ header Authorization
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Không có token, trả về lỗi xác thực
    }

    // Xác thực token
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Token không hợp lệ, trả về lỗi xác thực
        }

        // Token hợp lệ, lưu thông tin người dùng vào req.user
        req.user = user;

        next(); // Tiếp tục xử lý
    });
}

// Khởi động server
app.listen(8080, () => {
    console.log('Server đang chạy trên cổng 8080');
});
