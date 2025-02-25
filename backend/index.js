const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const multer = require('multer'); // 🛠 Xử lý upload ảnh
const FormData = require('form-data'); // 🛠 Import FormData để gửi request đúng định dạng

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ['GET', 'POST', "PUT", 'DELETE']
}));

// Middleware hỗ trợ xử lý form-data
const storage = multer.memoryStorage(); // 🛠 Lưu file vào bộ nhớ RAM
const upload = multer({ storage: storage });

app.post("/api/chat", upload.single("file"), async (req, res) => {
    try {
        console.log("📩 Nhận request:", req.body); // Debug xem có dữ liệu không

        const message = req.body.message;
        const height = req.body.height;
        const weight = req.body.weight;
        const file = req.file; // 🖼 Ảnh nếu có

        if (!message && !file) {
            return res.status(400).json({ error: "Cần nhập tin nhắn hoặc gửi ảnh" });
        }

        // Tạo form-data gửi đến AI
        const formData = new FormData();
        if (file) {
            formData.append("file", file.buffer, { filename: file.originalname });
        }
        if (message) {
            formData.append("message", message);
        }
        if (height && weight) {
            formData.append("userPreferences", JSON.stringify({ height, weight }));
        }

        console.log("📤 Gửi dữ liệu đến AI...");

        const response = await axios.post("http://localhost:8000/process_input", formData, {
            headers: { ...formData.getHeaders() }
        });

        console.log("✅ Nhận phản hồi từ AI:", response.data);
        res.json(response.data);
    } catch (error) {
        console.error("❌ Lỗi khi gọi AI API:", error);
        res.status(500).json({ error: "Lỗi khi xử lý yêu cầu AI", details: error.message });
    }
});

// 🚀 Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});
