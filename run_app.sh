#!/bin/bash

source ./venv/bin/activate

PORT=9000
fuser -k $PORT/tcp

./venv/bin/uvicorn main:app --bind 0.0.0.0 --port $PORT --access-log

deactivate