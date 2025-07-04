import os
import sys

sys.path.append("/netapp/INHouse/sg")
from SG_Authenticator import ScriptSG


class ShotGridClient:
    """
    ShotGrid API 호출을 관리하는 클라이언트 클래스
    """
    def __init__(self):
        script_sg = ScriptSG("idea")
        self.sg = script_sg.sg

    def get_project_by_name(self, name: str):
        return self.sg.find_one(
            "Project",
            [["name", "is", name]],
            ["id"]
        )

    def get_shots(self, project_id: int):
        return self.sg.find(
            "Shot",
            [["project.Project.id", "is", project_id]],
            ["id", "code", "sg_task", "sg_cut_in", "sg_cut_out"]
        )