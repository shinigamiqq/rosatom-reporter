from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Employee(BaseModel):
    fullname: str
    id: int
    department: str
    rang: str


@app.post("/employee")
async def post_employee(employee: Employee):
    print(f"fullname: {employee.fullname}, id: {employee.id}, department: {employee.department}, rang: {employee.rang}")
    return {"fullname": employee.fullname, "id": employee.id, "department": employee.department, "rang": employee.rang}

