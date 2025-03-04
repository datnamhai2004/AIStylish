const axios = require("axios");
const FormData = require("form-data");

exports.chatWithAI = async (req, res) => {
    try {
        console.log("📩 Nhận request từ Frontend:", req.body);
        const { message } = req.body;
        const file = req.file;
        const userPreferences = req.body.userPreferences ? JSON.parse(req.body.userPreferences) : {};

        if (!message && !file) {
            return res.status(400).json({ error: "Cần nhập tin nhắn hoặc gửi ảnh" });
        }

        const AI_SERVER_URL = "http://127.0.0.1:8000/api/process_input";
        let aiResponse;

        if (file) {
            console.log("🖼 Gửi ảnh đến AI...");
            const formData = new FormData();
            formData.append("file", file.buffer, { filename: file.originalname });
            if (message) formData.append("message", message);
            formData.append("userPreferences", JSON.stringify(userPreferences));

            aiResponse = await axios.post(AI_SERVER_URL, formData, {
                headers: { ...formData.getHeaders() }
            });
        } else {
            console.log("💬 Gửi tin nhắn đến AI...");
            aiResponse = await axios.post(AI_SERVER_URL, {
                message,
                userPreferences
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
};
