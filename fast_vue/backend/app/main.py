from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# CORS 설정: 프론트엔드( localhost:8080 )에서 호출 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/message")
def read_message():
    return {"message": "Hello from FastAPI!!!!"}

class EchoRequest(BaseModel):
    text: str

@app.post("/api/echo")
def echo(req: EchoRequest):
    return {"echo": req.text}