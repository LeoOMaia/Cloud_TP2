FROM python:latest

WORKDIR /app
COPY . /app

ARG UID=10001

RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

RUN apt-get update && \
    apt-get install -y wget && \
    rm -rf /var/lib/apt/lists/

RUN pip install -r requirements.txt

USER appuser

EXPOSE 32196

CMD python client.py -m flask run --host=0.0.0.0 --port 32196