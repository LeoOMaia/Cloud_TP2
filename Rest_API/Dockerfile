FROM python:latest

RUN pip install -r requirements.txt

WORKDIR /app
COPY . /app

EXPOSE 32196

CMD ["python", "server.py", "--host=0.0.0.0"]