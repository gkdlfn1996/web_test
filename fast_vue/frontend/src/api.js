// API 호출을 모듈화
export async function fetchShots(projectName) {
    const res = await fetch(`/api/project/${projectName}/shots`);
    return res.json();
}

export async function fetchProjects() {
    const res = await fetch('/api/projects')
    return res.json()
}
