FROM python:3.12-slim

COPY requirements.txt .
RUN pip install --timeout 100 -r requirements.txt
RUN apt-get update && apt-get install -y tesseract-ocr poppler-utils tesseract-ocr-rus libgl1 libglib2.0-0 libzbar0


COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
