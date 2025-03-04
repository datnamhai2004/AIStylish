import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();
const app = express();

console.log("🔑 OpenAI API Key:", process.env.OPENAI_API_KEY ? "✅ Đã tải API Key" : "❌ Chưa có API Key");

// ✅ Cấu hình CORS
app.use(cors());
app.use(express.json());

// ✅ Khởi tạo OpenAI API Client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ Định nghĩa API `/api/chatgpt`
app.post("/api/chatgpt", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Cần nhập tin nhắn" });
        }

        console.log("📩 Gửi tin nhắn đến ChatGPT:", message);

        const response = await openai.chat.completions.create({
            model: "gpt-4o", // Hoặc "gpt-3.5-turbo"
            messages: [{ role: "user", content: message }],
            max_tokens: 100
        });

        console.log("✅ Phản hồi từ ChatGPT:", response.choices[0].message.content);
        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error("❌ Lỗi khi gọi API ChatGPT:", error.message);
        res.status(500).json({ error: "Lỗi khi gọi API ChatGPT", details: error.message });
    }
});

// ✅ Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "127.0.0.1", () => {
    console.log(`🚀 Server đang chạy trên http://127.0.0.1:${PORT}`);
});
