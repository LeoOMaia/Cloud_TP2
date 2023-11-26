FROM python:latest

RUN pip install -r requirements.txt

WORKDIR /app
COPY . /app

CMD ["python", "ml.py"]