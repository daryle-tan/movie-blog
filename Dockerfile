FROM python:3.11-buster

WORKDIR /src

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "movie_proj.wsgi:application"]

