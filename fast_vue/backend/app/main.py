import os
from dotenv import load_dotenv
from fastapi import FastAPI # FastAPI 임포트
from fastapi.middleware.cors import CORSMiddleware
from . import models  # models.py 임포트 (models.Base.metadata.create_all 사용)
from contextlib import asynccontextmanager # asynccontextmanager 임포트
from . import router # router.py 임포트


# Lifespan 이벤트 핸들러 정의
@asynccontextmanager
async def lifespan(app: FastAPI):
    from .database import engine # database.py에서 engine 임포트
    models.Base.metadata.create_all(bind=engine) # 데이터베이스 테이블 생성
    yield

app = FastAPI(lifespan=lifespan) # lifespan 인자 전달

# CORS 설정: 프론트엔드( localhost:8080 )에서 호출 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 포함
app.include_router(router.router) # 라우터 포함


