FROM python:latest

RUN pip install -r requirements.txt

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

USER root

EXPOSE 32208

CMD python ml.py