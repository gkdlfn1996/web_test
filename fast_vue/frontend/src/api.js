// API 호출을 모듈화
export async function fetchMessage() {
    const res = await fetch('/api/message');
    return res.json();
  }
  
  export async function fetchShots(projectName) {
    const res = await fetch(`/api/project/${projectName}/shots`);
    return res.json();
  }
  