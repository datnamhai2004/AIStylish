import cv2
import mediapipe as mp
import numpy as np
import openai
import json
import os
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from PIL import Image
import io
from typing import Optional

# ========================== CẤU HÌNH OPENAI API ==========================
# 🛠 Đảm bảo API key đã được load
load_dotenv()  # Load biến môi trường từ file .env

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("🚨 Lỗi: OPENAI_API_KEY không tồn tại. Kiểm tra lại file .env")

client = openai.OpenAI(api_key=api_key)

# ========================== KHỞI TẠO FASTAPI ==========================
app = FastAPI()

# ========================== KHỞI TẠO MEDIA PIPE POSE ==========================
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# ========================== HÀM TRÍCH XUẤT KEYPOINTS ==========================
def extract_keypoints(image):
    """Trích xuất tọa độ các khớp cơ thể từ ảnh bằng MediaPipe Pose"""
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(image_rgb)

    keypoints = {}
    if results.pose_landmarks:
        for idx, landmark in enumerate(results.pose_landmarks.landmark):
            keypoints[idx] = {"x": landmark.x, "y": landmark.y}
    return keypoints

def calculate_measurements(keypoints):
    """Tính toán số đo cơ thể từ keypoints"""
    measurements = {}
    if keypoints:
        left_shoulder = keypoints.get(11, {"x": 0, "y": 0})
        right_shoulder = keypoints.get(12, {"x": 0, "y": 0})
        measurements["shoulder_width"] = abs(right_shoulder["x"] - left_shoulder["x"])

        left_waist = keypoints.get(23, {"x": 0, "y": 0})
        right_waist = keypoints.get(24, {"x": 0, "y": 0})
        measurements["waist_width"] = abs(right_waist["x"] - left_waist["x"])

        left_hip = keypoints.get(25, {"x": 0, "y": 0})
        right_hip = keypoints.get(26, {"x": 0, "y": 0})
        measurements["hip_width"] = abs(right_hip["x"] - left_hip["x"])

    return measurements

# ========================== HÀM XỬ LÝ TEXT & ẢNH ==========================
@app.post("/process_input")
async def process_input(
    file: UploadFile = File(None),
    message: str = Form(None),
    userPreferences: str = Form(None)
):
    """Nhận input từ người dùng (text hoặc ảnh hoặc cả hai)"""
    try:
        user_data = json.loads(userPreferences) if userPreferences else {}

        keypoints = None
        measurements_json = "{}"

        if file:
            contents = await file.read()
            image = np.array(Image.open(io.BytesIO(contents)))
            keypoints = extract_keypoints(image)

            if keypoints:
                measurements = calculate_measurements(keypoints)
                measurements_json = json.dumps(measurements)
            else:
                return JSONResponse(content={"error": "Không thể nhận diện dáng người từ ảnh."}, status_code=400)

        # 📝 Tạo prompt AI
        prompt = f"""
        Người dùng đang tìm kiếm tư vấn thời trang.
        
        - Tin nhắn: "{message if message else 'Không có'}"
        - Thông tin từ ảnh: {measurements_json}
        - Thông tin người dùng:
            + Chiều cao: {user_data.get("height", "Không có")}
            + Cân nặng: {user_data.get("weight", "Không có")}

        Hãy đưa ra lời khuyên về phong cách thời trang phù hợp dựa trên thông tin trên.
        """

        # ✅ Gọi OpenAI API với cú pháp mới
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=250
        )

        reply = response.choices[0].message.content
        return JSONResponse(content={"reply": reply, "keypoints": keypoints})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi gọi OpenAI: {str(e)}")
# ========================== CHẠY SERVER ==========================
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
