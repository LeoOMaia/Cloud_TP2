FROM python:latest

WORKDIR /app
COPY . /app

RUN pip install -r requirements.txt

EXPOSE 32196

CMD python server.py --host=0.0.0.0 --port 32196