FROM python:latest
RUN pip install mlxtend pandas
COPY ml.py /app/ml.py
WORKDIR /app
CMD ["python", "ml.py"]