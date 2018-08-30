FROM ubuntu:16.04
COPY requirements.txt gunicorn_config.py /app/
RUN apt update && apt upgrade
RUN apt install -y python-pip
RUN pip install -r /app/requirements.txt
COPY . /app/
WORKDIR /app
CMD ["gunicorn", "--config", "gunicorn_config.py", "app:app"]
