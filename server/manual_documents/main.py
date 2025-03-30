from fastapi import APIRouter
from pydantic import BaseModel


app = APIRouter()

class Documents(BaseModel):
    date: str
    price: str


@app.post("/manual_documents")
async def post_manual_documents(
    documents_request: Documents
):
    date = documents_request.date
    price = documents_request.price

    return {"Date": date, "Price": price}

