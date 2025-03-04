import cv2
import mediapipe as mp
import numpy as np
import openai
import json
import os
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException, Request, Form
from fastapi.responses import JSONResponse, HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from typing import Optional

# Tắt oneDNN để tránh thông báo từ TensorFlow
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

# Khởi tạo FastAPI
app = FastAPI()

# Thêm middleware CORS (chỉ khai báo một lần)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cấu hình đường dẫn file tĩnh
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_BUILD_DIR = os.path.join(BASE_DIR, "../frontend/build")

if not os.path.exists(FRONTEND_BUILD_DIR):
    raise RuntimeError(f"Directory '{FRONTEND_BUILD_DIR}' does not exist. Run 'npm run build' in frontend.")
app.mount("/", StaticFiles(directory=FRONTEND_BUILD_DIR, html=True), name="frontend")

# Đường dẫn ảnh sản phẩm
products_path = os.path.join(BASE_DIR, "..", "frontend", "build", "products")
if os.path.exists(products_path):
    print(f"✅ Serving product images from: {products_path}")
    app.mount("/products", StaticFiles(directory=products_path), name="products")
else:
    print(f"⚠️ Product images folder '{products_path}' not found.")

# Đường dẫn frontend static
frontend_build_path = os.path.join(BASE_DIR, "..", "frontend", "build")
if os.path.exists(frontend_build_path):
    print(f"✅ Serving frontend from: {frontend_build_path}")
    app.mount("/static", StaticFiles(directory=os.path.join(frontend_build_path, "static")), name="static")

# Cấu hình OpenAI
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Khởi tạo MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# Kho hàng mẫu
inventory = {
    "Áo phông oversize": {"tags": ["dáng quả lê", "dáng chữ nhật"], "category": "áo"},
    "Quần ống suông": {"tags": ["dáng quả lê", "dáng đồng hồ cát"], "category": "quần"},
    "Váy ôm sát": {"tags": ["dáng đồng hồ cát", "dáng tam giác ngược"], "category": "váy"},
    "Áo sơ mi dáng rộng": {"tags": ["dáng tam giác ngược", "dáng chữ nhật"], "category": "áo"}
}

# Hàm đọc prompt từ file
def load_prompt(file_path, measurements_json, inventory_json, height=None, weight=None):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            prompt_template = f.read()
        return prompt_template.format(
            measurements=measurements_json,
            inventory=inventory_json,
            height=height if height else "không có",
            weight=weight if weight else "không có"
        )
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Không tìm thấy file prompt.txt")

# Hàm lấy keypoints từ ảnh
def get_keypoints(image):
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(image_rgb)
    keypoints = {}
    if results.pose_landmarks:
        for idx, landmark in enumerate(results.pose_landmarks.landmark):
            keypoints[idx] = {"x": landmark.x, "y": landmark.y}
    return keypoints

# Hàm tính số đo
def get_measurements(keypoints):
    measurements = {}
    if keypoints:
        measurements["shoulder_width"] = abs(keypoints.get(12, {"x": 0})["x"] - keypoints.get(11, {"x": 0})["x"])
        measurements["waist_width"] = abs(keypoints.get(24, {"x": 0})["x"] - keypoints.get(23, {"x": 0})["x"])
        measurements["hip_width"] = abs(keypoints.get(26, {"x": 0})["x"] - keypoints.get(25, {"x": 0})["x"])
    return measurements

# Hàm phân tích bằng ChatGPT
def analyze_with_chatgpt(keypoints, inventory, height=None, weight=None):
    measurements = get_measurements(keypoints)
    measurements_json = json.dumps(measurements)
    inventory_json = json.dumps(inventory)
    prompt = load_prompt("prompt.txt", measurements_json, inventory_json, height, weight)
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(response["choices"][0]["message"]["content"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi gọi ChatGPT: {str(e)}")

# Endpoint phục vụ frontend
@app.get("/", response_class=HTMLResponse)
async def serve_frontend():
    index_path = os.path.join(frontend_build_path, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    raise HTTPException(status_code=404, detail="Không tìm thấy index.html trong frontend/build")

# Endpoint phân tích dáng người và chọn outfit
# @app.post("/style-analyze")
# async def style_analyze(file: UploadFile = File(...), height: Optional[float] = None, weight: Optional[float] = None):
#     contents = await file.read()
#     image = np.array(Image.open(io.BytesIO(contents)))
#     keypoints = get_keypoints(image)
#     if not keypoints:
#         raise HTTPException(status_code=400, detail="Không nhận diện được dáng người từ ảnh.")
#     result = analyze_with_chatgpt(keypoints, inventory, height, weight)
#     return JSONResponse(content={"body_shape": result["body_shape"], "outfit": result["outfit"]})



# Endpoint xử lý input từ backend
@app.post("/api/process_input")
async def process_input(
    request: Request,
    message: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    try:
        # Xử lý JSON request
        if request.headers.get("content-type") == "application/json":
            body = await request.json()
            message = body.get("message", None)
            return JSONResponse(content={
                "message": message,
                "file_received": False,
                "status": "Processed JSON request"
            })

        # Xử lý Form-data request
        if not message and not file:
            return JSONResponse(content={"error": "Cần nhập tin nhắn hoặc gửi ảnh"}, status_code=400)

        # Nếu có file, xử lý ảnh và phân tích
        if file:
            contents = await file.read()
            image = np.array(Image.open(io.BytesIO(contents)))
            keypoints = get_keypoints(image)
            if not keypoints:
                return JSONResponse(content={"error": "Không nhận diện được dáng người từ ảnh"}, status_code=400)
            result = analyze_with_chatgpt(keypoints, inventory)
            return JSONResponse(content={"body_shape": result["body_shape"], "outfit": result["outfit"]})

        # Nếu chỉ có message
        return JSONResponse(content={
            "message": message,
            "file_received": bool(file),
            "status": "Processed Form request"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi xử lý request: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)