#!/bin/bash

PORT=3000
fuser -k $PORT/tcp

serve -s -p $PORT --ssl-cert ./certs/MyCertificate.crt --ssl-key ./certs/MyKey.key --no-clipboard build