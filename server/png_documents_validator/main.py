from fastapi import APIRouter, File, UploadFile
import pytesseract
from PIL import Image
import re
import io
import dateparser
import cv2
import numpy as np
from pyzbar.pyzbar import decode

app = APIRouter()


@app.post('/train_png_documents')
async def post_png_train_documents(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read()))

    text = pytesseract.image_to_string(image, lang="rus")

    print(text)

    id_match = re.search(r"\b\d{2} \d{3} \d{3} \d{3} \d{3}", text)
    id_ticket = id_match.group(0) if id_match else "Номер эл. билета не найден"

    date_match = re.search(r"\b\d{2}\.\d{2}\.\d{4}\b", text)
    date = date_match.group(0) if date_match else "Дата не найдена"

    price_match = re.search(r"\b\d+,\d{2}\b", text)
    price = price_match.group(0) if price_match else "Цена не найдена"

    print(f"Дата поездки: {date}")
    print(f"Цена билета: {price} руб.")
    print(f"Номер эл. билета: {id_ticket}")
    return {"Date": date, "Price": float(price.replace(" ", "").replace("\xa0", "").replace(",", ".")), "Ticket": id_ticket}

@app.post('/air_png_documents')
async def post_png_air_documents(file: UploadFile = File(...)):

    image = Image.open(io.BytesIO(await file.read()))

    text = pytesseract.image_to_string(image, lang="rus+eng")
    reversed_text = "\n".join(reversed(text.splitlines()))
    print(text)

    id_match = re.search(r"\b\d{13}\b", text)
    id_ticket = id_match.group(0) if id_match else "Номер эл. билета не найден"
    date_pattern = (r"\b\d{2}\.\d{2}\.\d{4}\b|\b\d{2} (января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря) 202\d\b")
    date_match = re.search(date_pattern, text, re.IGNORECASE)
    date = date_match.group(0) if date_match else "Дата не найдена"

    price_match = re.search(r"\b(?!00)(\d{1,9}(?: \d{3})*(?:\.\d{2})?)\b", reversed_text)
    price = price_match.group(0) if price_match else "Цена не найдена"

    print(f"Дата поездки: {date}")
    print(f"Цена билета: {price} руб.")
    print(f"Номер эл. билета: {id_ticket}")
    return {"Date": date, "Price": float(price.replace(" ", "").replace("\xa0", "").replace(",", ".")), "Ticket": id_ticket}

@app.post('/hotel_checks')
async def post_png_hotel_checks(file: UploadFile = File(...)):
    extenstion_match = re.search(r"\b.(jpg|png|jpeg)\b", file.filename)
    extension = extenstion_match.group(0) if extenstion_match else "Некорректное расширение файла"
    if extension == ".jpg" or extension == ".png" or extension == ".jpeg":
        image = Image.open(io.BytesIO(await file.read()))
        image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        qr_codes = decode(image)
        for qr in qr_codes:
            qr_data = qr.data.decode('utf-8')
            print("QR-data:", qr_data)

            date_match = re.search(r't=(\d{4})(\d{2})(\d{2})T', qr_data)
            price_match = re.search(r's=([\d\.]+)', qr_data)

            price = price_match.group(1) if price_match else "Цена не найдена"

            if date_match:
                date = f"{date_match.group(3)}.{date_match.group(2)}.{date_match.group(1)}"
            else:
                date = "Дата не найдена"

            print(f"Дата: {date}")
            '''
            rect_points = qr.polygon
            if len(rect_points) == 4:
                pts = np.array(rect_points, dtype=np.int32)
                pts = pts.reshape((-1, 1, 2))
                cv2.polylines(image_cv, [pts], True, (0, 255, 0), 2)
            else:
                cv2.rectangle(image_cv, (qr.rect.left, qr.rect.top), 
                              (qr.rect.left + qr.rect.width, qr.rect.top + qr.rect.height), 
                              (0, 255, 0), 2)

            cv2.imwrite("processed_photo.png", image_cv)
            '''
            return {"Date": date, "Price": price}
