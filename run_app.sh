#!/bin/bash

source ./venv/bin/activate

PORT=9000
fuser -k $PORT/tcp

./venv/bin/uvicorn main:app --host 158.196.145.25 --port $PORT --access-log --ssl-keyfile ./hyperfei-frontend/certs/MyKey.key  --ssl-certfile ./hyperfei-frontend/certs/MyCertificate.crt
# uvicorn main:app --host 0.0.0.0 --port 10000 --log-level debug
# --ssl-keyfile ./hyperfei-frontend/certs/MyKey.key
# deactivate