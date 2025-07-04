from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .shotgrid_client import ShotGridClient

app = FastAPI()
sg_client = ShotGridClient()

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


@app.get("/api/project/{project_name}/shots")
def project_shots(project_name: str):
    project = sg_client.get_project_by_name(project_name)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    shots = sg_client.get_shots(project.get("id"))
    return {"shots": shots}