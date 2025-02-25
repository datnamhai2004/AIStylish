const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require("openai"); // ✅ Đúng cách khởi tạo OpenAI SDK

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ['GET', 'POST', "PUT", 'DELETE']
}));

// Middleware để xử lý JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Khởi tạo OpenAI API với API Key từ .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🟢 API Nhận tin nhắn từ frontend và gửi đến AI
app.post("/api/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Nội dung tin nhắn không được để trống" });
    }

    try {
        const prompt = `
        Người dùng đang tìm kiếm tư vấn thời trang. Dựa trên nội dung sau, hãy đề xuất trang phục phù hợp:
        "${message}"

        Hãy đưa ra các gợi ý cụ thể về kiểu dáng, màu sắc, cách kết hợp phụ kiện.
        `;

        // ✅ Sử dụng API GPT-4 đúng cách
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 200,
            temperature: 0.7,
        });

        const reply = aiResponse.choices[0].message.content.trim();
        res.json({ reply });

    } catch (error) {
        console.error("❌ Lỗi khi gọi OpenAI API:", error);
        res.status(500).json({ error: "Lỗi khi xử lý yêu cầu AI", details: error.message });
    }
});

// 🟢 Endpoint kiểm tra server
app.get('/', (req, res) => {
    return res.send('SERVER ON');
});

// 🚀 Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});
