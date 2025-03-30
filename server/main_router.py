from employee_validator.main import app as employeeValidatorApp
from png_documents_validator.main import app as pngDocumentsValidatorApp
from pdf_documents_validator.main import app as pdfDocumentsValidatorApp
from manual_documents.main import app as manualDocumentsApp
from report_xlsx.main import app as reportTableApp
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#app.include_router(employeeValidatorApp)
app.include_router(pngDocumentsValidatorApp)
app.include_router(pdfDocumentsValidatorApp)
app.include_router(manualDocumentsApp)
app.include_router(reportTableApp)

