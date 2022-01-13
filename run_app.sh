#!/bin/bash

source ./venv/bin/activate

PORT=9000
fuser -k $PORT/tcp

./venv/bin/uvicorn main:app --host 158.196.145.25 --port $PORT --access-log --ssl-keyfile ./hyperfei-frontend/certs/MyKey.key  --ssl-certfile ./hyperfei-frontend/certs/MyCertificate.crt
# --ssl-keyfile ./hyperfei-frontend/certs/MyKey.key
deactivate