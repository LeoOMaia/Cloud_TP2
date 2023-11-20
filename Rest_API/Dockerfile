FROM python:latest
RUN pip install flask pandas
COPY server.py /app/server.py
WORKDIR /app
EXPOSE 32196
CMD ["python", "server.py", "--host=0.0.0.0"]