from fastapi import APIRouter, File, UploadFile
import fitz
import re
import dateparser


app = APIRouter()


@app.post('/pdf_train_documents')
async def post_pdf_train_documents(file:UploadFile = File(...)):
    text = {}
    pdf_bytes = await file.read()

    try:
        with fitz.open("pdf", pdf_bytes) as doc:
            for num, page in enumerate(doc.pages()):
                text[num] = page.get_text()
    except Exception as e:
        return{"error": str(e)}

    id_match = re.search(r"\b\d{2} \d{3} \d{3} \d{3} \d{3}", text[0])
    id_ticket = id_match.group(0) if id_match else "Номер эл. билета не найден"
    date_match = re.search(r"(?:Оформлен:)\s*(\b\d{2}\.\d{2}\.\d{4}\b)", text[0])
    date = date_match.group(1) if date_match else "Дата не найдена"

    print(text[0])
    price_match = re.search(r"(?:Итого|Вкл\. НДС)\s*(\d{1,3}(?: \d{3})*(?:,\d{2})?)", text[0])
    price = price_match.group(1) if price_match else "Цена не найдена"
    return {"Date": date, "Price": float(price.replace(" ", "").replace("\xa0", "").replace(",", ".")), "Ticket": id_ticket}

@app.post('/pdf_air_documents')
async def post_pdf_air_documents(file:UploadFile = File(...)):
    text = {}
    pdf_bytes = await file.read()

    try:
        with fitz.open("pdf", pdf_bytes) as doc:
            for num, page in enumerate(doc.pages()):
                text[num] = page.get_text()
    except Exception as e:
        return {"error": str(e)}
    print(text[0])

    id_match = re.search(r"\b\d{13}\b", text[0])
    id_ticket = id_match.group(0) if id_match else "Номер эл. билета не найден"
    date_pattern = (r"\b\d{2}\.\d{2}\.\d{4}\b|\b\d{2} (января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря) 202\d\b")
    date_match = re.search(date_pattern, text[0], re.IGNORECASE)
    date = date_match.group(0) if date_match else "Дата не найдена"
    processed_date = dateparser.parse(date)
    price_pattern = (
        r"RUB\s*\u00A0?(\d{1,3}(?:[ \u00A0]?\d{3})*(?:[.,]\d{2})?)|"  # RUB 17429.08 или RUB 17 429.08
        r"(\d{1,3}(?:[ \u00A0]?\d{3})*(?:[.,]\d{2})?)\s*RUB"          # 17429.08 RUB или 17 429.08 RUB
    )
    prices = []
    for page_text in text.values():
        for match in re.finditer(price_pattern, page_text):
            price_str = match.group(1) or match.group(2)
            if price_str:
                price_num = float(price_str.replace(" ", "").replace("\xa0", "").replace(",", "."))
                prices.append(price_num)

    max_price = max(prices) if prices else "Цена не найдена"

    print("prices:", prices)

    return {"Date": processed_date, "Price": max_price, "Ticket": id_ticket}

@app.post('/pdf_hotel_documents')
async def post_pdf_hotel_documents(file: UploadFile = File(...)):
    text = {}
    pdf_bytes = await file.read()

    try:
        with fitz.open("pdf", pdf_bytes) as doc:
            for num, page in enumerate(doc.pages()):
                text[num] = page.get_text()
    except Exception as e:
        return {"error": str(e)}

    print(text)
