from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from pydantic import BaseModel # EchoRequest를 위해 추가
from .database import get_db # 상위 폴더의 database.py에서 get_db 임포트
from .shotgrid_client import ShotGridClient # sg_client 사용을 위해 추가

router = APIRouter()
sg_client = ShotGridClient() # 라우터 파일에서 sg_client 초기화

class EchoRequest(BaseModel):
    text: str

@router.post("/api/echo")
def echo(req: EchoRequest):
    return {"echo": req.text}

@router.get("/api/project/{project_name}/shots")
def project_shots(project_name: str):
    project = sg_client.get_project_by_name(project_name)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    shots = sg_client.get_shots(project.get("id"))
    return {"shots": shots}

@router.get("/api/projects")
def project_list():
    """
    프로젝트 이름 목록을 반환합니다。
    """
    projects = sg_client.get_projects()
    return {"projects": projects}

@router.get("/api/shot/{shot_id}/versions")
def shot_versions(shot_id: int):
    """
    특정 Shot의 버전 목록을 반환합니다.
    """
    versions = sg_client.get_versions_for_shot(shot_id)
    return {"versions": versions}

@router.get("/db-test")
async def db_test(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT 1")).scalar()
        if result == 1:
            return {"message": "Database connection successful!"}
        else:
            return {"message": "Database connection failed: Unexpected result."}
    except Exception as e:
        return {"message": f"Database connection failed: {e}"}
