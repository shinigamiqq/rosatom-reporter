FROM python:3.12-slim

COPY requirements.txt requirements.txt
RUN pip install --timeout 100 -r requirements.txt


COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
