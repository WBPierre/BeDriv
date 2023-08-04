FROM python:3.8

COPY src src
ADD requirements.txt .

RUN apt-get update &&\
    apt-get install -y build-essential python3-dev

RUN pip install --upgrade pip
RUN pip install wheel && pip install -r requirements.txt

EXPOSE 5000

ENV FLASK_APP bedriv.py

WORKDIR src

CMD flask run --host=0.0.0.0