FROM python:3.11-slim

ENV DEBIAN_FRONTEND=noninteractiv

RUN apt-get update && \
    apt-get install -y \
    python3 \
    python3-pip \
    snmp \
    snmpd \
    libsnmp-dev \
    net-tools \
    && apt-get clean


COPY requirements.txt /app/requirements.txt
RUN pip3 install --no-cache-dir -r /app/requirements.txt

COPY . /app

WORKDIR /app

EXPOSE 161/udp
EXPOSE 2161/udp
EXPOSE 8080/tcp


CMD ["sh", "-c", "service snmpd start && python3 run.py"]
