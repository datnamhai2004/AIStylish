import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import multer from "multer";
import FormData from "form-data";

// Cấu hình dotenv
dotenv.config();
const app = express();

// ✅ Cấu hình CORS
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

// ✅ Middleware xử lý JSON và form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Cấu hình multer để lưu ảnh trong bộ nhớ
const upload = multer({ storage: multer.memoryStorage() });

const AI_SERVER_URL = "http://127.0.0.1:8000/api/process_input";

async function checkAIHealth() {
    try {
        // Tạo FormData thay vì JSON
        const formData = new FormData();
        formData.append("message", "test");

        const response = await axios.post(AI_SERVER_URL, formData, {
            headers: { ...formData.getHeaders() } // Đảm bảo headers đúng
        });

        console.log("✅ AI Server phản hồi:", response.data);
    } catch (error) {
        console.error("❌ AI Server không hoạt động. Kiểm tra lại AI Server!");
        process.exit(1);
    }
}

// Gọi kiểm tra AI Server
// checkAIHealth();

// ✅ Route xử lý chat request
app.post("/api/chat", upload.single("file"), async (req, res) => {
    try {
        console.log("📩 Nhận request từ FE:", req.body);
        const { message, height, weight } = req.body;
        const file = req.file;

        if (!message && !file) {
            return res.status(400).json({ error: "Cần nhập tin nhắn hoặc gửi ảnh" });
        }

        let aiResponse;
        if (file) {
            console.log("🖼 Gửi ảnh đến AI...");
            const formData = new FormData();
            formData.append("file", file.buffer, { filename: file.originalname });
            if (message) formData.append("message", message);
            if (height && weight) {
                formData.append("userPreferences", JSON.stringify({ height, weight }));
            }

            aiResponse = await axios.post(AI_SERVER_URL, formData, {
                headers: { ...formData.getHeaders() }
            });
        } else {
            console.log("💬 Gửi tin nhắn đến AI...");
            aiResponse = await axios.post(AI_SERVER_URL, {
                message,
                userPreferences: { height, weight }
            }, {
                headers: { "Content-Type": "application/json" }
            });
        }

        console.log("✅ Phản hồi từ AI:", aiResponse.data);
        res.json(aiResponse.data);
    } catch (error) {
        console.error("❌ Lỗi khi gọi AI API:", error.response?.data || error.message);
        res.status(500).json({
            error: "Lỗi khi xử lý yêu cầu AI",
            details: error.response?.data || error.message
        });
    }
});

// ✅ Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "127.0.0.1", () => {
    console.log(`🚀 Server đang chạy trên 127.0.0.1:${PORT}`);
});