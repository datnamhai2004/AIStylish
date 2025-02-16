from pydantic import BaseModel
from openai import OpenAI
import pandas as pd
import os
import openai
from dotenv import load_dotenv
from fastapi import FastAPI
import uvicorn

# ============================= TẢI DỮ LIỆU VÀ CHUẨN HÓA =============================
data = pd.read_csv("customer_data.csv")
data['height'] = data['height'].apply(lambda x: x / 100)  # Convert cm to meters

# ============================= KẾT NỐI OPENAI =============================
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI()

# ============================= LỚP ĐỂ XỬ LÝ YÊU CẦU API =============================
class FashionAdviceRequest(BaseModel):
    height: float
    weight: float
    body_type: str
    style_preference: str

# ============================= TẢI PROMPT =============================
def load_prompt(file_path, **kwargs):
    with open(file_path, 'r', encoding='utf-8') as f:
        prompt = f.read()
    return prompt.format(**kwargs)

# ============================= FASTAPI ENDPOINT =============================
app = FastAPI()

@app.post("/fashion-advice/")
def get_fashion_advice(request: FashionAdviceRequest):
    # Phân tích dữ liệu thời trang từ CSV
    avg_data = data.groupby("style_preference").agg({"height": "mean", "weight": "mean"}).reset_index()
    closest_match = avg_data.iloc[(avg_data['height'] - request.height).abs().argsort()[:1]]
    suggested_style = closest_match["style_preference"].values[0]
    
    # Tạo prompt cho OpenAI
    user_data = {
        "height": request.height,
        "weight": request.weight,
        "body_type": request.body_type,
        "style_preference": request.style_preference,
        "suggested_style": suggested_style
    }
    prompt = load_prompt("prompt.txt", **user_data)
    
    # Gửi yêu cầu đến OpenAI
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Bạn là trợ lý thời trang thông minh."},
            {"role": "user", "content": prompt}
        ]
    )
    
    return {"advice": response.choices[0].message.content}

# ============================= CHẠY SERVER =============================
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
