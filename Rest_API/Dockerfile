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

RUN pip install -r requirements.txt

USER appuser

EXPOSE 32196

CMD python server.py --host=0.0.0.0 --port 32196