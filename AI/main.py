from pydantic import BaseModel
from openai import OpenAI
import pandas as pd
import os
import openai
from dotenv import load_dotenv

# Đọc dữ liệu
data = pd.read_csv("customer_data.csv")

# Chuẩn hóa dữ liệu
data['height'] = data['height'].apply(lambda x: x / 100)  # Convert cm to meters


# ===========================================================ĐIỀU KIỆN CẦN ĐỂ KẾT NỐI VỚI AI===============================================================================
# Tải API key từ .env
# Bắt buộc phải có API KEY của ChatGPT 4.o
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


client = OpenAI()

class CalendarEvent(BaseModel):
    name: str
    date: str
    participants: list[str]

completion = client.beta.chat.completions.parse(
    model="gpt-4o-2024-08-06",
    messages=[
        {"role": "system", "content": "Extract the event information."},
        {"role": "user", "content": "Alice and Bob are going to a science fair on Friday."},
    ],
    response_format=CalendarEvent,
)

event = completion.choices[0].message.parsed


# ===========================================================================================PROMPT===============================================

def load_prompt(file_path, **kwargs):
    with open(file_path, 'r', encoding='utf-8') as f:
        prompt = f.read()
    return prompt.format(**kwargs)

# Nhập dữ liệu từ người dùng
user_data = {
    "height": float(input("Enter height (m): ")),
    "weight": float(input("Enter weight (kg): ")),
    "body_type": input("Enter body type (vd: slim, athletic, etc.): "),
    "style_preference": input("Enter style preference (vd: casual, formal, etc.): ")
}

prompt = load_prompt("prompt.txt", **user_data)
print(prompt)
# ==========================================================================================================================================
